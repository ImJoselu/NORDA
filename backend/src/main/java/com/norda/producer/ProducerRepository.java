package com.norda.producer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProducerRepository extends JpaRepository<Producer, UUID> {

    Optional<Producer> findBySlug(String slug);

    List<Producer> findAllByRegionIdOrderByNameAsc(UUID regionId);
}
