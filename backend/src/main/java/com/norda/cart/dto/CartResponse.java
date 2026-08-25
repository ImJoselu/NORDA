package com.norda.cart.dto;

import java.util.List;

public record CartResponse(
        List<CartItemResponse> items,
        int itemCount,
        long subtotalCents,
        String couponCode,
        long discountCents,
        long totalCents
) {
}
