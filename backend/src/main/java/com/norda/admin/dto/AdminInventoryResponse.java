package com.norda.admin.dto;

import com.norda.inventory.Inventory;
import com.norda.inventory.InventoryStatus;
import com.norda.product.Grind;
import com.norda.product.ProductVariant;

import java.util.UUID;

public record AdminInventoryResponse(
        UUID productVariantId,
        UUID productId,
        String productName,
        String sku,
        int weightGrams,
        Grind grind,
        int stock,
        int reserved,
        int available,
        int minStock,
        InventoryStatus status
) {
    public static AdminInventoryResponse from(ProductVariant variant, Inventory inventory) {
        return new AdminInventoryResponse(
                variant.getId(), variant.getProduct().getId(), variant.getProduct().getName(), variant.getSku(),
                variant.getWeightGrams(), variant.getGrind(),
                inventory.getStock(), inventory.getReserved(), inventory.getAvailable(), inventory.getMinStock(),
                inventory.getStatus()
        );
    }
}
