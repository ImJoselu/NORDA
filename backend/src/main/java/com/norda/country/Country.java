package com.norda.country;

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
@Table(name = "countries")
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Continent continent;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(name = "typical_altitude_min_m", nullable = false)
    private int typicalAltitudeMinM;

    @Column(name = "typical_altitude_max_m", nullable = false)
    private int typicalAltitudeMaxM;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Country() {
        // JPA
    }

    public Country(String name, String slug, Continent continent, String description,
                   double latitude, double longitude, int typicalAltitudeMinM, int typicalAltitudeMaxM) {
        this.name = name;
        this.slug = slug;
        this.continent = continent;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.typicalAltitudeMinM = typicalAltitudeMinM;
        this.typicalAltitudeMaxM = typicalAltitudeMaxM;
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

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public Continent getContinent() {
        return continent;
    }

    public String getDescription() {
        return description;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public int getTypicalAltitudeMinM() {
        return typicalAltitudeMinM;
    }

    public int getTypicalAltitudeMaxM() {
        return typicalAltitudeMaxM;
    }

    public void update(String name, String description, double latitude, double longitude,
                        int typicalAltitudeMinM, int typicalAltitudeMaxM) {
        this.name = name;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.typicalAltitudeMinM = typicalAltitudeMinM;
        this.typicalAltitudeMaxM = typicalAltitudeMaxM;
    }
}
