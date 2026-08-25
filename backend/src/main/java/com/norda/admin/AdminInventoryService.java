package com.norda.admin;

import com.norda.admin.dto.AdminInventoryResponse;
import com.norda.inventory.Inventory;
import com.norda.inventory.InventoryRepository;
import com.norda.product.ProductVariant;
import com.norda.product.ProductVariantRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminInventoryService {

    private final ProductVariantRepository productVariantRepository;
    private final InventoryRepository inventoryRepository;

    public AdminInventoryService(ProductVariantRepository productVariantRepository, InventoryRepository inventoryRepository) {
        this.productVariantRepository = productVariantRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminInventoryResponse> list(boolean lowStockOnly) {
        List<ProductVariant> variants = productVariantRepository.findAll();
        Map<UUID, Inventory> inventoryByVariant = inventoryRepository.findAllById(variants.stream().map(ProductVariant::getId).toList())
                .stream().collect(Collectors.toMap(Inventory::getProductVariantId, i -> i));

        return variants.stream()
                .map(v -> AdminInventoryResponse.from(v, inventoryByVariant.get(v.getId())))
                .filter(r -> !lowStockOnly || r.status() != com.norda.inventory.InventoryStatus.IN_STOCK)
                .sorted((a, b) -> a.productName().compareTo(b.productName()))
                .toList();
    }

    public AdminInventoryResponse adjust(UUID variantId, int stock, int minStock) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Variante no encontrada."));
        Inventory inventory = inventoryRepository.findById(variantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventario no encontrado."));
        inventory.adjust(stock, minStock);
        return AdminInventoryResponse.from(variant, inventory);
    }
}
