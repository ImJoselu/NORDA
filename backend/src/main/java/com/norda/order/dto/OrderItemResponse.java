package com.norda.order.dto;

import com.norda.product.Grind;

import java.util.UUID;

public record OrderItemResponse(
        UUID productVariantId,
        String productName,
        int weightGrams,
        Grind grind,
        long unitPriceCents,
        int quantity,
        long lineTotalCents
) {
}
