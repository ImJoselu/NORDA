package com.norda.coupon;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CouponType type;

    @Column(nullable = false)
    private long value;

    @Column(name = "starts_at")
    private Instant startsAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "min_purchase_cents")
    private Long minPurchaseCents;

    @Column(name = "max_uses")
    private Integer maxUses;

    @Column(name = "used_count", nullable = false)
    private int usedCount;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Coupon() {
        // JPA
    }

    public Coupon(
            String code, CouponType type, long value, Instant startsAt, Instant expiresAt,
            Long minPurchaseCents, Integer maxUses, boolean active
    ) {
        this.code = code.toUpperCase();
        this.type = type;
        this.value = value;
        this.startsAt = startsAt;
        this.expiresAt = expiresAt;
        this.minPurchaseCents = minPurchaseCents;
        this.maxUses = maxUses;
        this.usedCount = 0;
        this.active = active;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public void update(
            CouponType type, long value, Instant startsAt, Instant expiresAt,
            Long minPurchaseCents, Integer maxUses, boolean active
    ) {
        this.type = type;
        this.value = value;
        this.startsAt = startsAt;
        this.expiresAt = expiresAt;
        this.minPurchaseCents = minPurchaseCents;
        this.maxUses = maxUses;
        this.active = active;
    }

    public boolean isCurrentlyValid(Instant now) {
        if (!active) return false;
        if (startsAt != null && now.isBefore(startsAt)) return false;
        if (expiresAt != null && now.isAfter(expiresAt)) return false;
        if (maxUses != null && usedCount >= maxUses) return false;
        return true;
    }

    public boolean meetsMinPurchase(long subtotalCents) {
        return minPurchaseCents == null || subtotalCents >= minPurchaseCents;
    }

    public long computeDiscountCents(long subtotalCents) {
        long discount = type == CouponType.PERCENTAGE ? Math.round(subtotalCents * (value / 100.0)) : value;
        return Math.min(discount, subtotalCents);
    }

    public void incrementUsage() {
        this.usedCount++;
    }

    public UUID getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public CouponType getType() {
        return type;
    }

    public long getValue() {
        return value;
    }

    public Instant getStartsAt() {
        return startsAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public Long getMinPurchaseCents() {
        return minPurchaseCents;
    }

    public Integer getMaxUses() {
        return maxUses;
    }

    public int getUsedCount() {
        return usedCount;
    }

    public boolean isActive() {
        return active;
    }
}
