package com.norda.product.dto;

import com.norda.product.Grind;

import java.util.UUID;

public record ProductVariantResponse(
        UUID id,
        int weightGrams,
        Grind grind,
        long priceCents,
        String availability
) {
}
