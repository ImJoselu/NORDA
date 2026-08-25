package com.norda.admin.dto;

import com.norda.country.Continent;
import com.norda.country.Country;

import java.util.UUID;

public record AdminCountryResponse(
        UUID id,
        String name,
        String slug,
        Continent continent,
        String description,
        double latitude,
        double longitude,
        int typicalAltitudeMinM,
        int typicalAltitudeMaxM
) {
    public static AdminCountryResponse from(Country c) {
        return new AdminCountryResponse(
                c.getId(), c.getName(), c.getSlug(), c.getContinent(), c.getDescription(),
                c.getLatitude(), c.getLongitude(), c.getTypicalAltitudeMinM(), c.getTypicalAltitudeMaxM()
        );
    }
}
