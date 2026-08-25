package com.norda.origin.dto;

public record RegionSummary(
        String name,
        String slug,
        double latitude,
        double longitude,
        int producerCount,
        int productCount
) {
}
