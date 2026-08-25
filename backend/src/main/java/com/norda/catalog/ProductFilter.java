package com.norda.catalog;

import com.norda.product.BrewMethod;
import com.norda.product.Process;
import com.norda.product.RoastLevel;

public record ProductFilter(
        String countrySlug,
        String regionSlug,
        String producerSlug,
        String variety,
        Process process,
        RoastLevel roastLevel,
        BrewMethod method,
        Integer minAltitude,
        Integer maxAltitude,
        Integer minAcidity,
        Integer maxAcidity,
        Integer minBody,
        Integer maxBody,
        Long minPriceCents,
        Long maxPriceCents,
        String q
) {
}
