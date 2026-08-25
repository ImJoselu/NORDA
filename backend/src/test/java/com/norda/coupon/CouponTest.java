package com.norda.coupon;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;

class CouponTest {

    @Test
    void percentageDiscountRoundsToNearestCent() {
        Coupon coupon = new Coupon("NORDA10", CouponType.PERCENTAGE, 10, null, null, null, null, true);

        assertThat(coupon.computeDiscountCents(2500)).isEqualTo(250);
        assertThat(coupon.computeDiscountCents(999)).isEqualTo(100); // 99.9 rounds to 100
    }

    @Test
    void fixedDiscountNeverExceedsSubtotal() {
        Coupon coupon = new Coupon("WELCOME15", CouponType.FIXED, 2000, null, null, null, null, true);

        assertThat(coupon.computeDiscountCents(500)).isEqualTo(500);
        assertThat(coupon.computeDiscountCents(5000)).isEqualTo(2000);
    }

    @Test
    void inactiveCouponIsNeverValid() {
        Coupon coupon = new Coupon("OFF", CouponType.PERCENTAGE, 10, null, null, null, null, false);

        assertThat(coupon.isCurrentlyValid(Instant.now())).isFalse();
    }

    @Test
    void couponBeforeItsStartDateIsNotValid() {
        Instant future = Instant.now().plus(1, ChronoUnit.DAYS);
        Coupon coupon = new Coupon("SOON", CouponType.PERCENTAGE, 10, future, null, null, null, true);

        assertThat(coupon.isCurrentlyValid(Instant.now())).isFalse();
    }

    @Test
    void couponAfterItsExpiryDateIsNotValid() {
        Instant past = Instant.now().minus(1, ChronoUnit.DAYS);
        Coupon coupon = new Coupon("GONE", CouponType.PERCENTAGE, 10, null, past, null, null, true);

        assertThat(coupon.isCurrentlyValid(Instant.now())).isFalse();
    }

    @Test
    void couponWithExhaustedUsesIsNotValid() {
        Coupon coupon = new Coupon("LIMITED", CouponType.PERCENTAGE, 10, null, null, null, 1, true);
        coupon.incrementUsage();

        assertThat(coupon.isCurrentlyValid(Instant.now())).isFalse();
    }

    @Test
    void couponWithRemainingUsesIsValid() {
        Coupon coupon = new Coupon("LIMITED", CouponType.PERCENTAGE, 10, null, null, null, 2, true);
        coupon.incrementUsage();

        assertThat(coupon.isCurrentlyValid(Instant.now())).isTrue();
    }

    @Test
    void minPurchaseIsEnforcedOnlyWhenSet() {
        Coupon withMinimum = new Coupon("WELCOME15", CouponType.PERCENTAGE, 15, null, null, 2000L, null, true);
        Coupon withoutMinimum = new Coupon("NORDA10", CouponType.PERCENTAGE, 10, null, null, null, null, true);

        assertThat(withMinimum.meetsMinPurchase(1999)).isFalse();
        assertThat(withMinimum.meetsMinPurchase(2000)).isTrue();
        assertThat(withoutMinimum.meetsMinPurchase(1)).isTrue();
    }

    @Test
    void codeIsAlwaysNormalizedToUppercase() {
        Coupon coupon = new Coupon("norda10", CouponType.PERCENTAGE, 10, null, null, null, null, true);

        assertThat(coupon.getCode()).isEqualTo("NORDA10");
    }
}
