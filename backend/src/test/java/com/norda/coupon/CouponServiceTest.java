package com.norda.coupon;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CouponServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @Mock
    private CouponUsageRepository couponUsageRepository;

    private CouponService service() {
        return new CouponService(couponRepository, couponUsageRepository);
    }

    @Test
    void unknownCodeThrowsNotFound() {
        when(couponRepository.findByCode("NOPE")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service().validateForUser("nope", UUID.randomUUID(), 1000))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("no existe");
    }

    @Test
    void codeLookupIsCaseInsensitive() {
        Coupon coupon = new Coupon("NORDA10", CouponType.PERCENTAGE, 10, null, null, null, null, true);
        when(couponRepository.findByCode("NORDA10")).thenReturn(Optional.of(coupon));
        when(couponUsageRepository.existsByCouponIdAndUserId(any(), any())).thenReturn(false);

        Coupon result = service().validateForUser("norda10", UUID.randomUUID(), 1000);

        assertThat(result.getCode()).isEqualTo("NORDA10");
    }

    @Test
    void expiredCouponIsRejected() {
        Coupon coupon = new Coupon("GONE", CouponType.PERCENTAGE, 10, null, Instant.now().minus(1, ChronoUnit.DAYS), null, null, true);
        when(couponRepository.findByCode("GONE")).thenReturn(Optional.of(coupon));

        assertThatThrownBy(() -> service().validateForUser("GONE", UUID.randomUUID(), 1000))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("ya no es válido");
    }

    @Test
    void subtotalBelowMinimumIsRejected() {
        Coupon coupon = new Coupon("WELCOME15", CouponType.PERCENTAGE, 15, null, null, 2000L, null, true);
        when(couponRepository.findByCode("WELCOME15")).thenReturn(Optional.of(coupon));

        assertThatThrownBy(() -> service().validateForUser("WELCOME15", UUID.randomUUID(), 1000))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("mínimo requerido");
    }

    @Test
    void alreadyUsedByThisUserIsRejected() {
        Coupon coupon = new Coupon("NORDA10", CouponType.PERCENTAGE, 10, null, null, null, null, true);
        UUID userId = UUID.randomUUID();
        when(couponRepository.findByCode("NORDA10")).thenReturn(Optional.of(coupon));
        when(couponUsageRepository.existsByCouponIdAndUserId(any(), any())).thenReturn(true);

        assertThatThrownBy(() -> service().validateForUser("NORDA10", userId, 1000))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Ya has usado");
    }

    @Test
    void recordUsageIncrementsCountAndSavesUsage() {
        Coupon coupon = new Coupon("NORDA10", CouponType.PERCENTAGE, 10, null, null, null, null, true);
        UUID userId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();

        service().recordUsage(coupon, userId, orderId);

        assertThat(coupon.getUsedCount()).isEqualTo(1);
        verify(couponUsageRepository).save(any(CouponUsage.class));
    }
}
