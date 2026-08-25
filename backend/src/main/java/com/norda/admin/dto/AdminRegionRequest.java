package com.norda.admin.dto;

import jakarta.validation.constraints.NotBlank;

/** slug y countryId solo se usan al crear; ver nota en AdminCountryRequest. */
public record AdminRegionRequest(
        @NotBlank String name,
        String slug,
        String countryId,
        @NotBlank String description,
        double latitude,
        double longitude
) {
}
