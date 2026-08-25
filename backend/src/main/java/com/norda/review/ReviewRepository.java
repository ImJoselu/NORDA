package com.norda.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findAllByProductIdAndStatusOrderByCreatedAtDesc(UUID productId, ReviewStatus status);

    Optional<Review> findByUserIdAndProductId(UUID userId, UUID productId);

    @Query("select coalesce(avg(r.rating), 0) from Review r where r.productId = :productId and r.status = 'VISIBLE'")
    double averageRating(@Param("productId") UUID productId);

    long countByProductIdAndStatus(UUID productId, ReviewStatus status);

    List<Review> findAllByOrderByCreatedAtDesc();
}
