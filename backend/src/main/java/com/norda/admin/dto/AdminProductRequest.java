package com.norda.admin.dto;

import com.norda.product.BrewMethod;
import com.norda.product.Process;
import com.norda.product.ProductStatus;
import com.norda.product.RoastLevel;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public record AdminProductRequest(
        String sku,
        String slug,
        @NotBlank String name,
        @NotBlank String shortDescription,
        @NotBlank String longDescription,
        @NotNull UUID countryId,
        @NotNull UUID regionId,
        @NotNull UUID producerId,
        @NotNull UUID farmId,
        @NotBlank String variety,
        @NotNull Process process,
        @Positive int altitudeM,
        @NotNull RoastLevel roastLevel,
        @NotEmpty List<String> tastingNotes,
        @Min(1) @Max(5) int acidity,
        @Min(1) @Max(5) int body,
        @Min(1) @Max(5) int sweetness,
        @NotEmpty Set<BrewMethod> recommendedMethods,
        @NotNull ProductStatus status,
        @Positive long basePriceCents
) {
}
