package com.norda.product.dto;

import com.norda.product.Process;
import com.norda.product.ProductStatus;
import com.norda.product.RoastLevel;

import java.util.List;
import java.util.UUID;

public record ProductSummaryResponse(
        UUID id,
        String sku,
        String name,
        String slug,
        String shortDescription,
        String countryName,
        String countrySlug,
        String regionName,
        String regionSlug,
        RoastLevel roastLevel,
        Process process,
        List<String> tastingNotes,
        int acidity,
        int body,
        int sweetness,
        long priceFromCents,
        ProductStatus status
) {
}
