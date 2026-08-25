package com.norda.product.dto;

import com.norda.product.BrewMethod;
import com.norda.product.Process;
import com.norda.product.RoastLevel;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public record ProductDetailResponse(
        UUID id,
        String sku,
        String name,
        String slug,
        String shortDescription,
        String longDescription,
        OriginSummary origin,
        String variety,
        Process process,
        int altitudeM,
        RoastLevel roastLevel,
        List<String> tastingNotes,
        int acidity,
        int body,
        int sweetness,
        Set<BrewMethod> recommendedMethods,
        LotSummary lot,
        List<ProductVariantResponse> variants
) {
}
