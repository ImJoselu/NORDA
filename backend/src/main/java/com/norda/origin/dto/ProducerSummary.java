package com.norda.origin.dto;

import java.util.List;

public record ProducerSummary(
        String name,
        String slug,
        String description,
        List<FarmSummary> farms
) {
}
