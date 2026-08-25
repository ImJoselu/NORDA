package com.norda.origin.dto;

public record CountrySummary(
        String name,
        String slug,
        double latitude,
        double longitude,
        int productCount
) {
}
