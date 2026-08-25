package com.norda.subscription;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    List<Subscription> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Subscription> findByIdAndUserId(UUID id, UUID userId);
}
