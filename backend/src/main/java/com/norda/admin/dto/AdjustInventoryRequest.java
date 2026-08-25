package com.norda.admin.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AdjustInventoryRequest(
        @NotNull @Min(0) Integer stock,
        @NotNull @Min(0) Integer minStock
) {
}
