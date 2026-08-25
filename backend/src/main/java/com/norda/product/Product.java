package com.norda.product;

import com.norda.country.Country;
import com.norda.producer.Farm;
import com.norda.producer.Producer;
import com.norda.region.Region;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Los FK de country/region/producer se mantienen tambien aqui (ademas de en
 * farm) de forma deliberadamente denormalizada: el catalogo (seccion 17)
 * filtra por pais/region/productor constantemente y forzar un join de 4
 * niveles en cada consulta de listado no compensa frente a duplicar 3 claves.
 */
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "short_description", nullable = false)
    private String shortDescription;

    @Column(name = "long_description", nullable = false, columnDefinition = "text")
    private String longDescription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producer_id", nullable = false)
    private Producer producer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_lot_id")
    private CoffeeLot currentLot;

    @Column(nullable = false)
    private String variety;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Process process;

    @Column(name = "altitude_m", nullable = false)
    private int altitudeM;

    @Enumerated(EnumType.STRING)
    @Column(name = "roast_level", nullable = false)
    private RoastLevel roastLevel;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_tasting_notes", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "position")
    @Column(name = "note", nullable = false)
    private List<String> tastingNotes;

    @Column(nullable = false)
    private int acidity;

    @Column(nullable = false)
    private int body;

    @Column(nullable = false)
    private int sweetness;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_recommended_methods", joinColumns = @JoinColumn(name = "product_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "method", nullable = false)
    private Set<BrewMethod> recommendedMethods = new LinkedHashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status;

    /**
     * Precio de la variante mas barata, desnormalizado para poder filtrar/ordenar
     * el catalogo por precio sin una subconsulta correlacionada por request.
     */
    @Column(name = "base_price_cents", nullable = false)
    private long basePriceCents;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Product() {
        // JPA
    }

    public Product(
            String sku, String name, String slug, String shortDescription, String longDescription,
            Country country, Region region, Producer producer, Farm farm, CoffeeLot currentLot,
            String variety, Process process, int altitudeM, RoastLevel roastLevel,
            List<String> tastingNotes, int acidity, int body, int sweetness,
            Set<BrewMethod> recommendedMethods, ProductStatus status, long basePriceCents
    ) {
        this.sku = sku;
        this.name = name;
        this.slug = slug;
        this.shortDescription = shortDescription;
        this.longDescription = longDescription;
        this.country = country;
        this.region = region;
        this.producer = producer;
        this.farm = farm;
        this.currentLot = currentLot;
        this.variety = variety;
        this.process = process;
        this.altitudeM = altitudeM;
        this.roastLevel = roastLevel;
        this.tastingNotes = tastingNotes;
        this.acidity = acidity;
        this.body = body;
        this.sweetness = sweetness;
        this.recommendedMethods = recommendedMethods;
        this.status = status;
        this.basePriceCents = basePriceCents;
    }

    /** sku y slug se mantienen inmutables tras la creacion (identifican URLs y referencias externas). */
    public void update(
            String name, String shortDescription, String longDescription,
            Country country, Region region, Producer producer, Farm farm, CoffeeLot currentLot,
            String variety, Process process, int altitudeM, RoastLevel roastLevel,
            List<String> tastingNotes, int acidity, int body, int sweetness,
            Set<BrewMethod> recommendedMethods, ProductStatus status, long basePriceCents
    ) {
        this.name = name;
        this.shortDescription = shortDescription;
        this.longDescription = longDescription;
        this.country = country;
        this.region = region;
        this.producer = producer;
        this.farm = farm;
        this.currentLot = currentLot;
        this.variety = variety;
        this.process = process;
        this.altitudeM = altitudeM;
        this.roastLevel = roastLevel;
        this.tastingNotes = tastingNotes;
        this.acidity = acidity;
        this.body = body;
        this.sweetness = sweetness;
        this.recommendedMethods = recommendedMethods;
        this.status = status;
        this.basePriceCents = basePriceCents;
    }

    public void updateStatus(ProductStatus status) {
        this.status = status;
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

    public UUID getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public String getLongDescription() {
        return longDescription;
    }

    public Country getCountry() {
        return country;
    }

    public Region getRegion() {
        return region;
    }

    public Producer getProducer() {
        return producer;
    }

    public Farm getFarm() {
        return farm;
    }

    public CoffeeLot getCurrentLot() {
        return currentLot;
    }

    public String getVariety() {
        return variety;
    }

    public Process getProcess() {
        return process;
    }

    public int getAltitudeM() {
        return altitudeM;
    }

    public RoastLevel getRoastLevel() {
        return roastLevel;
    }

    public List<String> getTastingNotes() {
        return tastingNotes;
    }

    public int getAcidity() {
        return acidity;
    }

    public int getBody() {
        return body;
    }

    public int getSweetness() {
        return sweetness;
    }

    public Set<BrewMethod> getRecommendedMethods() {
        return recommendedMethods;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public long getBasePriceCents() {
        return basePriceCents;
    }
}
