package com.norda.cart;

import com.norda.cart.dto.CartItemResponse;
import com.norda.cart.dto.CartResponse;
import com.norda.inventory.Inventory;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class CartMapper {

    private CartMapper() {
    }

    public static CartResponse toResponse(List<CartItem> items, Map<UUID, Inventory> inventoryByVariantId) {
        return toResponse(items, inventoryByVariantId, null, 0);
    }

    public static CartResponse toResponse(
            List<CartItem> items, Map<UUID, Inventory> inventoryByVariantId, String couponCode, long discountCents
    ) {
        List<CartItemResponse> itemResponses = items.stream()
                .map(item -> toItemResponse(item, inventoryByVariantId))
                .toList();

        long subtotal = itemResponses.stream().mapToLong(CartItemResponse::lineTotalCents).sum();
        int itemCount = itemResponses.stream().mapToInt(CartItemResponse::quantity).sum();
        long total = Math.max(0, subtotal - discountCents);

        return new CartResponse(itemResponses, itemCount, subtotal, couponCode, discountCents, total);
    }

    private static CartItemResponse toItemResponse(CartItem item, Map<UUID, Inventory> inventoryByVariantId) {
        var variant = item.getProductVariant();
        Inventory inventory = inventoryByVariantId.get(variant.getId());
        String availability = inventory == null ? "OUT_OF_STOCK" : inventory.getStatus().name();

        return new CartItemResponse(
                item.getId(),
                variant.getId(),
                variant.getProduct().getName(),
                variant.getProduct().getSlug(),
                variant.getWeightGrams(),
                variant.getGrind(),
                variant.getPriceCents(),
                item.getQuantity(),
                variant.getPriceCents() * (long) item.getQuantity(),
                availability
        );
    }
}
