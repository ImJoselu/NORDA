package com.norda.cart.dto;

import com.norda.product.Grind;

import java.util.UUID;

public record CartItemResponse(
        UUID id,
        UUID productVariantId,
        String productName,
        String productSlug,
        int weightGrams,
        Grind grind,
        long unitPriceCents,
        int quantity,
        long lineTotalCents,
        String availability
) {
}
