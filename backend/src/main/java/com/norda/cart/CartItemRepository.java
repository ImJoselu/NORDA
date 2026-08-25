package com.norda.cart;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    List<CartItem> findAllByCartIdOrderByCreatedAtAsc(UUID cartId);

    Optional<CartItem> findByCartIdAndProductVariantId(UUID cartId, UUID productVariantId);

    Optional<CartItem> findByIdAndCartId(UUID id, UUID cartId);

    void deleteAllByCartId(UUID cartId);
}
