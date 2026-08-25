package com.norda.order;

import com.norda.product.Grind;
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
import jakarta.persistence.Table;

import java.util.UUID;

/**
 * Snapshot de los datos del producto en el momento de la compra (nombre,
 * formato, precio): si el producto cambia despues, el pedido no debe cambiar.
 */
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private int position;

    @Column(name = "product_variant_id", nullable = false)
    private UUID productVariantId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "weight_grams", nullable = false)
    private int weightGrams;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Grind grind;

    @Column(name = "unit_price_cents", nullable = false)
    private long unitPriceCents;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "line_total_cents", nullable = false)
    private long lineTotalCents;

    protected OrderItem() {
        // JPA
    }

    public OrderItem(UUID productVariantId, String productName, int weightGrams, Grind grind, long unitPriceCents, int quantity) {
        this.productVariantId = productVariantId;
        this.productName = productName;
        this.weightGrams = weightGrams;
        this.grind = grind;
        this.unitPriceCents = unitPriceCents;
        this.quantity = quantity;
        this.lineTotalCents = unitPriceCents * quantity;
    }

    void assignOrder(Order order, int position) {
        this.order = order;
        this.position = position;
    }

    public UUID getId() {
        return id;
    }

    public UUID getProductVariantId() {
        return productVariantId;
    }

    public String getProductName() {
        return productName;
    }

    public int getWeightGrams() {
        return weightGrams;
    }

    public Grind getGrind() {
        return grind;
    }

    public long getUnitPriceCents() {
        return unitPriceCents;
    }

    public int getQuantity() {
        return quantity;
    }

    public long getLineTotalCents() {
        return lineTotalCents;
    }
}
