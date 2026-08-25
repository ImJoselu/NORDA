package com.norda.product.dto;

public record OriginSummary(
        String countryName,
        String countrySlug,
        String regionName,
        String regionSlug,
        String producerName,
        String producerSlug,
        String farmName,
        String farmSlug
) {
}
