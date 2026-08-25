package com.norda.producer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FarmRepository extends JpaRepository<Farm, UUID> {

    Optional<Farm> findBySlug(String slug);

    List<Farm> findAllByProducerIdOrderByNameAsc(UUID producerId);
}
