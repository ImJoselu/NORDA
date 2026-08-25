package com.norda.subscription.dto;

import com.norda.subscription.SubscriptionFrequency;
import com.norda.subscription.SubscriptionType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record CreateSubscriptionRequest(
        @Min(1) @Max(2) int coffeeCount,
        @NotNull SubscriptionFrequency frequency,
        @NotNull SubscriptionType type,
        List<UUID> fixedProductIds,
        String originCountrySlug
) {
}
