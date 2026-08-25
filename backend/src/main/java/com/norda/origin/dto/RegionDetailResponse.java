package com.norda.origin.dto;

import com.norda.product.dto.ProductSummaryResponse;

import java.util.List;

public record RegionDetailResponse(
        String name,
        String slug,
        String description,
        double latitude,
        double longitude,
        CountryRef country,
        List<ProducerSummary> producers,
        List<ProductSummaryResponse> products
) {
}
