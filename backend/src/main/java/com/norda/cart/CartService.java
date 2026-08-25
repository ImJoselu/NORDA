package com.norda.cart;

import com.norda.cart.dto.CartResponse;
import com.norda.coupon.Coupon;
import com.norda.coupon.CouponService;
import com.norda.inventory.Inventory;
import com.norda.inventory.InventoryRepository;
import com.norda.product.ProductVariant;
import com.norda.product.ProductVariantRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    private static final int MAX_QUANTITY_PER_ITEM = 20;

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final InventoryRepository inventoryRepository;
    private final CouponService couponService;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductVariantRepository productVariantRepository,
            InventoryRepository inventoryRepository,
            CouponService couponService
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.inventoryRepository = inventoryRepository;
        this.couponService = couponService;
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(UUID userId) {
        return cartRepository.findByUserId(userId)
                .map(this::buildResponse)
                .orElseGet(() -> new CartResponse(List.of(), 0, 0, null, 0, 0));
    }

    public CartResponse addItem(UUID userId, UUID productVariantId, int quantity) {
        Cart cart = getOrCreateCart(userId);
        ProductVariant variant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Variante no encontrada."));

        CartItem item = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), variant.getId())
                .orElseGet(() -> cartItemRepository.save(new CartItem(cart, variant, 0)));

        int newQuantity = Math.min(MAX_QUANTITY_PER_ITEM, item.getQuantity() + quantity);
        item.setQuantity(newQuantity);

        return buildResponse(cart);
    }

    public CartResponse updateItemQuantity(UUID userId, UUID itemId, int quantity) {
        Cart cart = requireCart(userId);
        CartItem item = cartItemRepository.findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El artículo no está en tu carrito."));

        item.setQuantity(Math.min(MAX_QUANTITY_PER_ITEM, quantity));

        return buildResponse(cart);
    }

    public CartResponse removeItem(UUID userId, UUID itemId) {
        Cart cart = requireCart(userId);
        CartItem item = cartItemRepository.findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El artículo no está en tu carrito."));

        cartItemRepository.delete(item);

        return buildResponse(cart);
    }

    public void clear(UUID userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> cartItemRepository.deleteAllByCartId(cart.getId()));
    }

    public CartResponse applyCoupon(UUID userId, String code) {
        Cart cart = requireCart(userId);
        long subtotal = subtotalCents(cart.getId());
        // Se valida aqui solo para dar feedback inmediato; el checkout vuelve a validar.
        couponService.validateForUser(code, userId, subtotal);
        cart.applyCoupon(code.toUpperCase());
        return buildResponse(cart);
    }

    public CartResponse removeCoupon(UUID userId) {
        Cart cart = requireCart(userId);
        cart.removeCoupon();
        return buildResponse(cart);
    }

    private Cart getOrCreateCart(UUID userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> cartRepository.save(new Cart(userId)));
    }

    private Cart requireCart(UUID userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No tienes un carrito activo."));
    }

    private long subtotalCents(UUID cartId) {
        return cartItemRepository.findAllByCartIdOrderByCreatedAtAsc(cartId).stream()
                .mapToLong(item -> item.getProductVariant().getPriceCents() * (long) item.getQuantity())
                .sum();
    }

    private CartResponse buildResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findAllByCartIdOrderByCreatedAtAsc(cart.getId());
        List<UUID> variantIds = items.stream().map(item -> item.getProductVariant().getId()).toList();
        Map<UUID, Inventory> inventoryByVariantId = inventoryRepository.findAllById(variantIds).stream()
                .collect(Collectors.toMap(Inventory::getProductVariantId, inventory -> inventory));

        if (cart.getCouponCode() == null) {
            return CartMapper.toResponse(items, inventoryByVariantId);
        }

        long subtotal = items.stream().mapToLong(i -> i.getProductVariant().getPriceCents() * (long) i.getQuantity()).sum();
        try {
            Coupon coupon = couponService.validateForUser(cart.getCouponCode(), cart.getUserId(), subtotal);
            long discount = coupon.computeDiscountCents(subtotal);
            return CartMapper.toResponse(items, inventoryByVariantId, cart.getCouponCode(), discount);
        } catch (ResponseStatusException ex) {
            // El cupon dejo de ser valido (caducidad, limite de usos...) entre aplicarlo y verlo: se retira.
            cart.removeCoupon();
            return CartMapper.toResponse(items, inventoryByVariantId);
        }
    }
}
