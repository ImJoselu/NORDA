package com.norda.order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

    List<Order> findAllByUserIdAndStatusIn(UUID userId, List<OrderStatus> statuses);

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findAllByStatusOrderByCreatedAtDesc(OrderStatus status);

    Optional<Order> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByOrderNumber(String orderNumber);
}
