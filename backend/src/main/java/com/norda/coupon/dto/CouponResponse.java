package com.norda.coupon.dto;

import com.norda.coupon.CouponType;

import java.time.Instant;
import java.util.UUID;

public record CouponResponse(
        UUID id,
        String code,
        CouponType type,
        long value,
        Instant startsAt,
        Instant expiresAt,
        Long minPurchaseCents,
        Integer maxUses,
        int usedCount,
        boolean active
) {
}
