package com.norda.origin.dto;

import java.util.List;

public record ContinentGroup(
        String continent,
        List<CountrySummary> countries
) {
}
