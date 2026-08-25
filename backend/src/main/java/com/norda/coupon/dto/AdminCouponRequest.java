package com.norda.coupon.dto;

import com.norda.coupon.CouponType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.Instant;

public record AdminCouponRequest(
        @NotBlank String code,
        @NotNull CouponType type,
        @Positive long value,
        Instant startsAt,
        Instant expiresAt,
        Long minPurchaseCents,
        Integer maxUses,
        boolean active
) {
}
