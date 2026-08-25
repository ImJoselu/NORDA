package com.norda.product.dto;

import java.time.LocalDate;

public record LotSummary(
        String code,
        LocalDate harvestDate,
        LocalDate roastDate
) {
}
