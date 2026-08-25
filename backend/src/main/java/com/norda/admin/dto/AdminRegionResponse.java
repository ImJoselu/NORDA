package com.norda.admin.dto;

import com.norda.region.Region;

import java.util.UUID;

public record AdminRegionResponse(
        UUID id,
        String name,
        String slug,
        UUID countryId,
        String countryName,
        String description,
        double latitude,
        double longitude
) {
    public static AdminRegionResponse from(Region r) {
        return new AdminRegionResponse(
                r.getId(), r.getName(), r.getSlug(), r.getCountry().getId(), r.getCountry().getName(),
                r.getDescription(), r.getLatitude(), r.getLongitude()
        );
    }
}
