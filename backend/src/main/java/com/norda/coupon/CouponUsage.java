package com.norda.coupon;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "coupon_usages")
public class CouponUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "coupon_id", nullable = false)
    private UUID couponId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "order_id")
    private UUID orderId;

    @Column(name = "used_at", nullable = false, updatable = false)
    private Instant usedAt;

    protected CouponUsage() {
        // JPA
    }

    public CouponUsage(UUID couponId, UUID userId, UUID orderId) {
        this.couponId = couponId;
        this.userId = userId;
        this.orderId = orderId;
    }

    @PrePersist
    void onCreate() {
        this.usedAt = Instant.now();
    }

    public UUID getCouponId() {
        return couponId;
    }

    public UUID getUserId() {
        return userId;
    }
}
