package com.norda.cart;

import com.norda.cart.dto.AddCartItemRequest;
import com.norda.cart.dto.CartResponse;
import com.norda.cart.dto.UpdateCartItemRequest;
import com.norda.common.security.CurrentUser;
import com.norda.coupon.dto.ApplyCouponRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartResponse get(Authentication authentication) {
        return cartService.getCart(CurrentUser.id(authentication));
    }

    @PostMapping("/items")
    public CartResponse addItem(Authentication authentication, @Valid @RequestBody AddCartItemRequest request) {
        return cartService.addItem(CurrentUser.id(authentication), request.productVariantId(), request.quantity());
    }

    @PatchMapping("/items/{itemId}")
    public CartResponse updateItem(
            Authentication authentication,
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return cartService.updateItemQuantity(CurrentUser.id(authentication), itemId, request.quantity());
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse removeItem(Authentication authentication, @PathVariable UUID itemId) {
        return cartService.removeItem(CurrentUser.id(authentication), itemId);
    }

    @DeleteMapping
    public ResponseEntity<Void> clear(Authentication authentication) {
        cartService.clear(CurrentUser.id(authentication));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/coupon")
    public CartResponse applyCoupon(Authentication authentication, @Valid @RequestBody ApplyCouponRequest request) {
        return cartService.applyCoupon(CurrentUser.id(authentication), request.code());
    }

    @DeleteMapping("/coupon")
    public CartResponse removeCoupon(Authentication authentication) {
        return cartService.removeCoupon(CurrentUser.id(authentication));
    }
}
