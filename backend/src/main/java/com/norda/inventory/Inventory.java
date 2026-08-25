package com.norda.inventory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * 1-1 con ProductVariant. available = stock - reserved (seccion 28); reserved
 * crece durante el checkout (fase 7) y se libera si el pedido no se confirma.
 */
@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @Column(name = "product_variant_id")
    private UUID productVariantId;

    @Column(nullable = false)
    private int stock;

    @Column(nullable = false)
    private int reserved;

    @Column(name = "min_stock", nullable = false)
    private int minStock;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Inventory() {
        // JPA
    }

    public Inventory(UUID productVariantId, int stock, int minStock) {
        this.productVariantId = productVariantId;
        this.stock = stock;
        this.reserved = 0;
        this.minStock = minStock;
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getProductVariantId() {
        return productVariantId;
    }

    public int getStock() {
        return stock;
    }

    public int getReserved() {
        return reserved;
    }

    public int getAvailable() {
        return stock - reserved;
    }

    public int getMinStock() {
        return minStock;
    }

    public InventoryStatus getStatus() {
        if (getAvailable() <= 0) return InventoryStatus.OUT_OF_STOCK;
        if (getAvailable() <= minStock) return InventoryStatus.LOW_STOCK;
        return InventoryStatus.IN_STOCK;
    }

    public void adjust(int stock, int minStock) {
        this.stock = stock;
        this.minStock = minStock;
    }
}
