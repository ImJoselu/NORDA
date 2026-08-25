package com.norda.subscription;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * No existe un job que genere pedidos automaticamente en cada nextDeliveryDate
 * (eso es un sistema de facturacion recurrente completo, fuera del alcance de
 * un backend de portfolio): esta entidad gestiona el ciclo de vida real de la
 * suscripcion (crear/pausar/reanudar/cancelar/cambiar/omitir), no el envio fisico.
 */
@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @Column(name = "coffee_count", nullable = false)
    private int coffeeCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionFrequency frequency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionType type;

    @Column(name = "origin_country_id")
    private UUID originCountryId;

    @Column(name = "next_delivery_date", nullable = false)
    private LocalDate nextDeliveryDate;

    @OneToMany(mappedBy = "subscription", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<SubscriptionItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Subscription() {
        // JPA
    }

    public Subscription(
            UUID userId, int coffeeCount, SubscriptionFrequency frequency, SubscriptionType type, UUID originCountryId
    ) {
        this.userId = userId;
        this.status = SubscriptionStatus.ACTIVE;
        this.coffeeCount = coffeeCount;
        this.frequency = frequency;
        this.type = type;
        this.originCountryId = originCountryId;
        this.nextDeliveryDate = frequency.nextDate(LocalDate.now());
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

    public void addItem(SubscriptionItem item) {
        items.add(item);
        item.assignSubscription(this);
    }

    public void clearItems() {
        items.clear();
    }

    public void pause() {
        this.status = SubscriptionStatus.PAUSED;
    }

    public void resume() {
        this.status = SubscriptionStatus.ACTIVE;
    }

    public void cancel() {
        this.status = SubscriptionStatus.CANCELLED;
    }

    public void skipNext() {
        this.nextDeliveryDate = frequency.nextDate(this.nextDeliveryDate);
    }

    public void update(int coffeeCount, SubscriptionFrequency frequency, SubscriptionType type, UUID originCountryId) {
        this.coffeeCount = coffeeCount;
        this.frequency = frequency;
        this.type = type;
        this.originCountryId = originCountryId;
    }

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public int getCoffeeCount() {
        return coffeeCount;
    }

    public SubscriptionFrequency getFrequency() {
        return frequency;
    }

    public SubscriptionType getType() {
        return type;
    }

    public UUID getOriginCountryId() {
        return originCountryId;
    }

    public LocalDate getNextDeliveryDate() {
        return nextDeliveryDate;
    }

    public List<SubscriptionItem> getItems() {
        return items;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
