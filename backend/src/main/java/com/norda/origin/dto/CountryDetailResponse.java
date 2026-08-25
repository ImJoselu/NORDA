package com.norda.origin.dto;

import com.norda.product.dto.ProductSummaryResponse;

import java.util.List;

public record CountryDetailResponse(
        String name,
        String slug,
        String continent,
        String description,
        double latitude,
        double longitude,
        OriginStats stats,
        List<RegionSummary> regions,
        List<ProductSummaryResponse> relatedProducts
) {
}
