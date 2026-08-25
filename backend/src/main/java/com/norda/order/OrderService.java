package com.norda.order;

import com.norda.cart.Cart;
import com.norda.cart.CartItem;
import com.norda.cart.CartItemRepository;
import com.norda.cart.CartMapper;
import com.norda.cart.CartRepository;
import com.norda.cart.dto.CartResponse;
import com.norda.coupon.Coupon;
import com.norda.coupon.CouponService;
import com.norda.inventory.Inventory;
import com.norda.inventory.InventoryRepository;
import com.norda.notification.EmailService;
import com.norda.order.dto.CheckoutRequest;
import com.norda.order.dto.OrderResponse;
import com.norda.order.dto.OrderSummaryResponse;
import com.norda.payment.Payment;
import com.norda.payment.PaymentChargeRequest;
import com.norda.payment.PaymentChargeResult;
import com.norda.payment.PaymentRepository;
import com.norda.payment.PaymentService;
import com.norda.payment.PaymentStatus;
import com.norda.product.ProductVariant;
import com.norda.product.ProductVariantRepository;
import com.norda.shipping.ShippingProvider;
import com.norda.user.User;
import com.norda.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

/**
 * Orquesta el checkout como una unica transaccion (seccion 25/28): reserva de
 * inventario atomica, creacion del pedido, cobro via PaymentService y, segun
 * el resultado, confirmacion (consume la reserva) o liberacion de stock.
 */
@Service
@Transactional
public class OrderService {

    private static final double VAT_RATE = 0.21;

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final ShippingProvider shippingProvider;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final ProductVariantRepository productVariantRepository;
    private final CouponService couponService;

    public OrderService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            OrderRepository orderRepository,
            InventoryRepository inventoryRepository,
            PaymentService paymentService,
            PaymentRepository paymentRepository,
            ShippingProvider shippingProvider,
            UserRepository userRepository,
            EmailService emailService,
            ProductVariantRepository productVariantRepository,
            CouponService couponService
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
        this.shippingProvider = shippingProvider;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.productVariantRepository = productVariantRepository;
        this.couponService = couponService;
    }

    public OrderResponse checkout(UUID userId, CheckoutRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tu carrito está vacío."));
        List<CartItem> cartItems = cartItemRepository.findAllByCartIdOrderByCreatedAtAsc(cart.getId());
        if (cartItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tu carrito está vacío.");
        }

        List<ReservedLine> reserved = reserveInventory(cartItems);

        long subtotalCents = cartItems.stream()
                .mapToLong(item -> item.getProductVariant().getPriceCents() * item.getQuantity())
                .sum();
        long shippingCents = shippingProvider.costCents(request.shippingMethod(), subtotalCents);

        Coupon coupon = null;
        long discountCents = 0;
        if (cart.getCouponCode() != null) {
            coupon = couponService.validateForUser(cart.getCouponCode(), userId, subtotalCents);
            discountCents = coupon.computeDiscountCents(subtotalCents);
        }

        long taxCents = Math.round(subtotalCents * VAT_RATE / (1 + VAT_RATE));
        long totalCents = subtotalCents + shippingCents - discountCents;

        Order order = new Order(
                userId, generateOrderNumber(), request.shippingAddress(), request.shippingMethod(),
                subtotalCents, shippingCents, discountCents, taxCents, totalCents, cart.getCouponCode()
        );
        for (CartItem item : cartItems) {
            var variant = item.getProductVariant();
            order.addItem(new OrderItem(
                    variant.getId(), variant.getProduct().getName(), variant.getWeightGrams(),
                    variant.getGrind(), variant.getPriceCents(), item.getQuantity()
            ));
        }
        order = orderRepository.save(order);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        PaymentChargeResult result = paymentService.charge(
                new PaymentChargeRequest(order.getId(), totalCents, "EUR", user.getEmail())
        );

        if (result.succeeded()) {
            reserved.forEach(line -> inventoryRepository.commit(line.variantId(), line.quantity()));
            order.markPaid();
            paymentRepository.save(new Payment(
                    order.getId(), paymentService.provider(), PaymentStatus.SUCCEEDED, result.externalReference(), totalCents
            ));
            cartItemRepository.deleteAllByCartId(cart.getId());
            cart.removeCoupon();
            if (coupon != null) {
                couponService.recordUsage(coupon, userId, order.getId());
            }
            emailService.sendOrderConfirmationEmail(user.getEmail(), order.getOrderNumber(), totalCents);
        } else {
            reserved.forEach(line -> inventoryRepository.release(line.variantId(), line.quantity()));
            order.markCancelled();
            paymentRepository.save(new Payment(
                    order.getId(), paymentService.provider(), PaymentStatus.FAILED, null, totalCents
            ));
            throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "No se pudo procesar el pago.");
        }

        return OrderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> list(UUID userId) {
        return orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderMapper::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse get(UUID userId, UUID orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado."));
        return OrderMapper.toResponse(order);
    }

    /**
     * Vuelve a anadir al carrito los articulos de un pedido pasado, usando el
     * precio ACTUAL de cada variante (no el historico del pedido).
     */
    public CartResponse reorder(UUID userId, UUID orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado."));

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> cartRepository.save(new Cart(userId)));

        for (OrderItem item : order.getItems()) {
            ProductVariant variant = productVariantRepository.findById(item.getProductVariantId()).orElse(null);
            if (variant == null) {
                continue;
            }
            CartItem cartItem = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), variant.getId())
                    .orElseGet(() -> cartItemRepository.save(new CartItem(cart, variant, 0)));
            cartItem.setQuantity(Math.min(20, cartItem.getQuantity() + item.getQuantity()));
        }

        List<CartItem> items = cartItemRepository.findAllByCartIdOrderByCreatedAtAsc(cart.getId());
        List<UUID> variantIds = items.stream().map(i -> i.getProductVariant().getId()).toList();
        Map<UUID, Inventory> inventoryByVariantId = inventoryRepository.findAllById(variantIds).stream()
                .collect(Collectors.toMap(Inventory::getProductVariantId, inventory -> inventory));

        return CartMapper.toResponse(items, inventoryByVariantId);
    }

    /** Reserva cada linea de forma atomica; si alguna falla, libera lo ya reservado antes de fallar. */
    private List<ReservedLine> reserveInventory(List<CartItem> cartItems) {
        List<ReservedLine> reserved = new ArrayList<>();
        for (CartItem item : cartItems) {
            UUID variantId = item.getProductVariant().getId();
            int rowsUpdated = inventoryRepository.tryReserve(variantId, item.getQuantity());
            if (rowsUpdated == 0) {
                reserved.forEach(line -> inventoryRepository.release(line.variantId(), line.quantity()));
                String productName = item.getProductVariant().getProduct().getName();
                throw new ResponseStatusException(HttpStatus.CONFLICT, "No hay stock suficiente de " + productName + ".");
            }
            reserved.add(new ReservedLine(variantId, item.getQuantity()));
        }
        return reserved;
    }

    private String generateOrderNumber() {
        String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String candidate = "NORDA-" + date + "-" + String.format("%04d", ThreadLocalRandom.current().nextInt(10_000));
        return orderRepository.existsByOrderNumber(candidate) ? generateOrderNumber() : candidate;
    }

    private record ReservedLine(UUID variantId, int quantity) {
    }
}
