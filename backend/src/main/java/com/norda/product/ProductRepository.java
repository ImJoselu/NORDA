package com.norda.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlugAndStatus(String slug, ProductStatus status);

    boolean existsBySlug(String slug);

    List<Product> findTop6ByStatusOrderByCreatedAtDesc(ProductStatus status);

    List<Product> findByCountryIdAndStatus(UUID countryId, ProductStatus status);

    List<Product> findByRegionIdAndStatus(UUID regionId, ProductStatus status);

    List<Product> findAllByStatus(ProductStatus status);
}
