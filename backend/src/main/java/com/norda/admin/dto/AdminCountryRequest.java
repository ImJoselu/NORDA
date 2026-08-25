package com.norda.admin.dto;

import com.norda.country.Continent;
import jakarta.validation.constraints.NotBlank;

/**
 * slug y continent solo se usan al crear; el pais existente no cambia de
 * identidad (evita romper URLs publicas /origins/{slug} ya indexadas).
 */
public record AdminCountryRequest(
        @NotBlank String name,
        String slug,
        Continent continent,
        @NotBlank String description,
        double latitude,
        double longitude,
        int typicalAltitudeMinM,
        int typicalAltitudeMaxM
) {
}
