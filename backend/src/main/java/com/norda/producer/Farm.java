package com.norda.producer;

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
import java.util.UUID;

@Entity
@Table(name = "farms")
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producer_id", nullable = false)
    private Producer producer;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "altitude_m", nullable = false)
    private int altitudeM;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Farm() {
        // JPA
    }

    public Farm(Producer producer, String name, String slug, int altitudeM, String description) {
        this.producer = producer;
        this.name = name;
        this.slug = slug;
        this.altitudeM = altitudeM;
        this.description = description;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public Producer getProducer() {
        return producer;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public int getAltitudeM() {
        return altitudeM;
    }

    public String getDescription() {
        return description;
    }
}
