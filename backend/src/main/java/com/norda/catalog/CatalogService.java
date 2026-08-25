package com.norda.catalog;

import com.norda.common.web.PageResponse;
import com.norda.inventory.Inventory;
import com.norda.inventory.InventoryRepository;
import com.norda.product.Product;
import com.norda.product.ProductMapper;
import com.norda.product.ProductRepository;
import com.norda.product.ProductStatus;
import com.norda.product.ProductVariant;
import com.norda.product.ProductVariantRepository;
import com.norda.product.dto.ProductDetailResponse;
import com.norda.product.dto.ProductSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CatalogService {

    private static final int MAX_PAGE_SIZE = 60;

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final InventoryRepository inventoryRepository;

    public CatalogService(
            ProductRepository productRepository,
            ProductVariantRepository productVariantRepository,
            InventoryRepository inventoryRepository
    ) {
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public PageResponse<ProductSummaryResponse> search(ProductFilter filter, ProductSort sort, int page, int size) {
        Specification<Product> spec = Specification.where(ProductSpecifications.hasStatus(ProductStatus.ACTIVE));

        if (filter.countrySlug() != null) spec = spec.and(ProductSpecifications.countrySlugEquals(filter.countrySlug()));
        if (filter.regionSlug() != null) spec = spec.and(ProductSpecifications.regionSlugEquals(filter.regionSlug()));
        if (filter.producerSlug() != null) spec = spec.and(ProductSpecifications.producerSlugEquals(filter.producerSlug()));
        if (filter.variety() != null) spec = spec.and(ProductSpecifications.varietyEquals(filter.variety()));
        if (filter.process() != null) spec = spec.and(ProductSpecifications.processEquals(filter.process()));
        if (filter.roastLevel() != null) spec = spec.and(ProductSpecifications.roastLevelEquals(filter.roastLevel()));
        if (filter.method() != null) spec = spec.and(ProductSpecifications.methodEquals(filter.method()));
        if (filter.minAltitude() != null) spec = spec.and(ProductSpecifications.altitudeAtLeast(filter.minAltitude()));
        if (filter.maxAltitude() != null) spec = spec.and(ProductSpecifications.altitudeAtMost(filter.maxAltitude()));
        if (filter.minAcidity() != null) spec = spec.and(ProductSpecifications.acidityAtLeast(filter.minAcidity()));
        if (filter.maxAcidity() != null) spec = spec.and(ProductSpecifications.acidityAtMost(filter.maxAcidity()));
        if (filter.minBody() != null) spec = spec.and(ProductSpecifications.bodyAtLeast(filter.minBody()));
        if (filter.maxBody() != null) spec = spec.and(ProductSpecifications.bodyAtMost(filter.maxBody()));
        if (filter.minPriceCents() != null) spec = spec.and(ProductSpecifications.priceAtLeast(filter.minPriceCents()));
        if (filter.maxPriceCents() != null) spec = spec.and(ProductSpecifications.priceAtMost(filter.maxPriceCents()));
        if (filter.q() != null && !filter.q().isBlank()) spec = spec.and(ProductSpecifications.searchText(filter.q()));

        Pageable pageable = PageRequest.of(page, Math.min(size, MAX_PAGE_SIZE), sort.toSort());
        Page<Product> result = productRepository.findAll(spec, pageable);

        return PageResponse.from(result.map(ProductMapper::toSummary));
    }

    public List<ProductSummaryResponse> featured() {
        return productRepository.findTop6ByStatusOrderByCreatedAtDesc(ProductStatus.ACTIVE).stream()
                .map(ProductMapper::toSummary)
                .toList();
    }

    public ProductDetailResponse detail(String slug) {
        Product product = productRepository.findBySlugAndStatus(slug, ProductStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cafe no encontrado."));

        List<ProductVariant> variants = productVariantRepository.findByProductIdOrderByWeightGramsAsc(product.getId());
        List<UUID> variantIds = variants.stream().map(ProductVariant::getId).toList();
        Map<UUID, Inventory> inventoryByVariantId = inventoryRepository.findAllById(variantIds).stream()
                .collect(Collectors.toMap(Inventory::getProductVariantId, inventory -> inventory));

        return ProductMapper.toDetail(product, variants, inventoryByVariantId);
    }
}
