package com.norda.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * Un Product tiene una variante por combinacion peso x molienda (seccion 14).
 * El precio y el stock viven aqui, nunca en Product.
 */
@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(name = "weight_grams", nullable = false)
    private int weightGrams;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Grind grind;

    @Column(name = "price_cents", nullable = false)
    private long priceCents;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected ProductVariant() {
        // JPA
    }

    public ProductVariant(Product product, String sku, int weightGrams, Grind grind, long priceCents) {
        this.product = product;
        this.sku = sku;
        this.weightGrams = weightGrams;
        this.grind = grind;
        this.priceCents = priceCents;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public String getSku() {
        return sku;
    }

    public int getWeightGrams() {
        return weightGrams;
    }

    public Grind getGrind() {
        return grind;
    }

    public long getPriceCents() {
        return priceCents;
    }
}
