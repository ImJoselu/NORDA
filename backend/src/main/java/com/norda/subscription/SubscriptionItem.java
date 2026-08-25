package com.norda.subscription;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.util.UUID;

/**
 * Solo se usa cuando Subscription.type == FIXED: cada fila es uno de los cafes
 * fijos elegidos. Para SURPRISE/ORIGIN_DISCOVERY no hay items (la seleccion no
 * la decide el cliente).
 */
@Entity
@Table(name = "subscription_items")
public class SubscriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    protected SubscriptionItem() {
        // JPA
    }

    public SubscriptionItem(UUID productId) {
        this.productId = productId;
    }

    void assignSubscription(Subscription subscription) {
        this.subscription = subscription;
    }

    public UUID getId() {
        return id;
    }

    public UUID getProductId() {
        return productId;
    }
}
