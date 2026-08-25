package com.norda.region;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RegionRepository extends JpaRepository<Region, UUID> {

    Optional<Region> findBySlug(String slug);

    List<Region> findAllByCountryIdOrderByNameAsc(UUID countryId);
}
