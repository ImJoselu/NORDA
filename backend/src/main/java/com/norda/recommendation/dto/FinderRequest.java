package com.norda.recommendation.dto;

import com.norda.product.BrewMethod;
import com.norda.recommendation.AcidityPreference;
import com.norda.recommendation.BodyPreference;
import com.norda.recommendation.BudgetRange;
import com.norda.recommendation.FlavorProfile;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record FinderRequest(
        @NotNull BrewMethod method,
        @NotEmpty Set<FlavorProfile> profiles,
        @NotNull BodyPreference body,
        @NotNull AcidityPreference acidity,
        @NotNull BudgetRange budget
) {
}
