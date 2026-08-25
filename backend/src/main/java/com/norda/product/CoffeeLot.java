package com.norda.product;

import com.norda.producer.Farm;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Trazabilidad del lote fisico (seccion 29). Un Product referencia el lote
 * actualmente en venta; el codigo sigue el patron PAIS-REGION-AAAA-MM.
 */
@Entity
@Table(name = "coffee_lots")
public class CoffeeLot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "harvest_date", nullable = false)
    private LocalDate harvestDate;

    @Column(name = "roast_date", nullable = false)
    private LocalDate roastDate;

    @Column(name = "quantity_kg", nullable = false)
    private int quantityKg;

    @Column(nullable = false)
    private String supplier;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected CoffeeLot() {
        // JPA
    }

    public CoffeeLot(Farm farm, String code, LocalDate harvestDate, LocalDate roastDate, int quantityKg, String supplier) {
        this.farm = farm;
        this.code = code;
        this.harvestDate = harvestDate;
        this.roastDate = roastDate;
        this.quantityKg = quantityKg;
        this.supplier = supplier;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public Farm getFarm() {
        return farm;
    }

    public String getCode() {
        return code;
    }

    public LocalDate getHarvestDate() {
        return harvestDate;
    }

    public LocalDate getRoastDate() {
        return roastDate;
    }

    public int getQuantityKg() {
        return quantityKg;
    }

    public String getSupplier() {
        return supplier;
    }
}
