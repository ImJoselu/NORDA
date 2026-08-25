package com.norda.order;

import com.norda.cart.Cart;
import com.norda.cart.CartItem;
import com.norda.cart.CartItemRepository;
import com.norda.cart.CartRepository;
import com.norda.coupon.Coupon;
import com.norda.coupon.CouponService;
import com.norda.coupon.CouponType;
import com.norda.inventory.InventoryRepository;
import com.norda.notification.EmailService;
import com.norda.order.dto.CheckoutRequest;
import com.norda.order.dto.OrderResponse;
import com.norda.payment.PaymentChargeResult;
import com.norda.payment.PaymentProvider;
import com.norda.payment.PaymentRepository;
import com.norda.payment.PaymentService;
import com.norda.product.Grind;
import com.norda.product.Product;
import com.norda.product.ProductVariant;
import com.norda.product.ProductVariantRepository;
import com.norda.shipping.ShippingMethod;
import com.norda.shipping.ShippingProvider;
import com.norda.user.User;
import com.norda.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private CartRepository cartRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private InventoryRepository inventoryRepository;
    @Mock private PaymentService paymentService;
    @Mock private PaymentRepository paymentRepository;
    @Mock private ShippingProvider shippingProvider;
    @Mock private UserRepository userRepository;
    @Mock private EmailService emailService;
    @Mock private ProductVariantRepository productVariantRepository;
    @Mock private CouponService couponService;

    private final UUID userId = UUID.randomUUID();
    private final UUID variantId = UUID.randomUUID();
    private Cart cart;
    private CartItem cartItem;
    private CheckoutRequest checkoutRequest;

    private OrderService service() {
        return new OrderService(
                cartRepository, cartItemRepository, orderRepository, inventoryRepository, paymentService,
                paymentRepository, shippingProvider, userRepository, emailService, productVariantRepository, couponService
        );
    }

    @BeforeEach
    void setUp() {
        Product product = org.mockito.Mockito.mock(Product.class);
        lenient().when(product.getName()).thenReturn("Colombia Huila — Finca La Esperanza");

        ProductVariant variant = org.mockito.Mockito.mock(ProductVariant.class);
        lenient().when(variant.getId()).thenReturn(variantId);
        lenient().when(variant.getProduct()).thenReturn(product);
        lenient().when(variant.getPriceCents()).thenReturn(1250L);
        lenient().when(variant.getWeightGrams()).thenReturn(250);
        lenient().when(variant.getGrind()).thenReturn(Grind.WHOLE_BEAN);

        cart = new Cart(userId);
        cartItem = new CartItem(cart, variant, 2);

        checkoutRequest = new CheckoutRequest(
                new ShippingAddress("Ana Diaz", "Calle Mayor 10", null, "Madrid", "Madrid", "28013", "España", "600123456"),
                ShippingMethod.STANDARD
        );

        lenient().when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        lenient().when(cartItemRepository.findAllByCartIdOrderByCreatedAtAsc(any())).thenReturn(List.of(cartItem));
        lenient().when(inventoryRepository.tryReserve(eq(variantId), anyInt())).thenReturn(1);
        lenient().when(shippingProvider.costCents(any(), anyLong())).thenReturn(500L);
        lenient().when(orderRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        lenient().when(orderRepository.existsByOrderNumber(any())).thenReturn(false);

        User user = new User("ana@example.com", "hash", "Ana", "Diaz", Set.of());
        lenient().when(userRepository.findById(userId)).thenReturn(Optional.of(user));
    }

    @Test
    void successfulCheckoutCommitsStockAndMarksOrderPaid() {
        when(paymentService.charge(any())).thenReturn(PaymentChargeResult.success("ch_123"));
        when(paymentService.provider()).thenReturn(PaymentProvider.DEMO);

        OrderResponse response = service().checkout(userId, checkoutRequest);

        assertThat(response.status()).isEqualTo(OrderStatus.PAID);
        assertThat(response.subtotalCents()).isEqualTo(2500); // 1250 * 2
        assertThat(response.shippingCents()).isEqualTo(500);
        assertThat(response.totalCents()).isEqualTo(3000);
        verify(inventoryRepository).commit(variantId, 2);
        verify(inventoryRepository, never()).release(any(), anyInt());
        verify(cartItemRepository).deleteAllByCartId(cart.getId());
        verify(emailService).sendOrderConfirmationEmail(eq("ana@example.com"), any(), eq(3000L));
    }

    @Test
    void emptyCartIsRejectedBeforeReservingAnyStock() {
        when(cartItemRepository.findAllByCartIdOrderByCreatedAtAsc(any())).thenReturn(List.of());

        assertThatThrownBy(() -> service().checkout(userId, checkoutRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("carrito está vacío");

        verify(inventoryRepository, never()).tryReserve(any(), anyInt());
    }

    @Test
    void insufficientStockReleasesAlreadyReservedLinesAndFails() {
        UUID secondVariantId = UUID.randomUUID();
        ProductVariant secondVariant = org.mockito.Mockito.mock(ProductVariant.class);
        Product secondProduct = org.mockito.Mockito.mock(Product.class);
        lenient().when(secondProduct.getName()).thenReturn("Etiopía Yirgacheffe");
        lenient().when(secondVariant.getId()).thenReturn(secondVariantId);
        lenient().when(secondVariant.getProduct()).thenReturn(secondProduct);
        lenient().when(secondVariant.getPriceCents()).thenReturn(1500L);
        CartItem secondItem = new CartItem(cart, secondVariant, 1);

        when(cartItemRepository.findAllByCartIdOrderByCreatedAtAsc(any())).thenReturn(List.of(cartItem, secondItem));
        when(inventoryRepository.tryReserve(eq(variantId), anyInt())).thenReturn(1); // first line reserves fine
        when(inventoryRepository.tryReserve(eq(secondVariantId), anyInt())).thenReturn(0); // second line has no stock

        assertThatThrownBy(() -> service().checkout(userId, checkoutRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("No hay stock suficiente");

        verify(inventoryRepository).release(variantId, 2); // the first, already-reserved line gets rolled back
        verify(orderRepository, never()).save(any());
        verify(paymentService, never()).charge(any());
    }

    @Test
    void failedPaymentReleasesStockAndCancelsTheOrder() {
        when(paymentService.charge(any())).thenReturn(PaymentChargeResult.failure("card_declined"));
        when(paymentService.provider()).thenReturn(PaymentProvider.DEMO);

        assertThatThrownBy(() -> service().checkout(userId, checkoutRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("pago");

        verify(inventoryRepository).release(variantId, 2);
        verify(inventoryRepository, never()).commit(any(), anyInt());
        verify(cartItemRepository, never()).deleteAllByCartId(any());
        verify(emailService, never()).sendOrderConfirmationEmail(any(), any(), anyLong());
    }

    @Test
    void validCouponDiscountsTheTotalAndIsRecordedOnlyOnSuccess() {
        cart.applyCoupon("NORDA10");
        Coupon coupon = new Coupon("NORDA10", CouponType.PERCENTAGE, 10, null, null, null, null, true);
        when(couponService.validateForUser(eq("NORDA10"), eq(userId), anyLong())).thenReturn(coupon);
        when(paymentService.charge(any())).thenReturn(PaymentChargeResult.success("ch_123"));
        when(paymentService.provider()).thenReturn(PaymentProvider.DEMO);

        OrderResponse response = service().checkout(userId, checkoutRequest);

        assertThat(response.discountCents()).isEqualTo(250); // 10% of 2500
        assertThat(response.totalCents()).isEqualTo(2750); // 2500 + 500 shipping - 250 discount
        verify(couponService, times(1)).recordUsage(eq(coupon), eq(userId), any());
    }

    @Test
    void failedPaymentNeverRecordsCouponUsage() {
        cart.applyCoupon("NORDA10");
        Coupon coupon = new Coupon("NORDA10", CouponType.PERCENTAGE, 10, null, null, null, null, true);
        when(couponService.validateForUser(eq("NORDA10"), eq(userId), anyLong())).thenReturn(coupon);
        when(paymentService.charge(any())).thenReturn(PaymentChargeResult.failure("card_declined"));
        when(paymentService.provider()).thenReturn(PaymentProvider.DEMO);

        assertThatThrownBy(() -> service().checkout(userId, checkoutRequest)).isInstanceOf(ResponseStatusException.class);

        verify(couponService, never()).recordUsage(any(), any(), any());
    }
}
