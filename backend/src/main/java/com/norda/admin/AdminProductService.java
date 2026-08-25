package com.norda.admin;

import com.norda.admin.dto.AdminProductDetailResponse;
import com.norda.admin.dto.AdminProductRequest;
import com.norda.country.Country;
import com.norda.country.CountryRepository;
import com.norda.inventory.Inventory;
import com.norda.inventory.InventoryRepository;
import com.norda.producer.Farm;
import com.norda.producer.FarmRepository;
import com.norda.producer.Producer;
import com.norda.producer.ProducerRepository;
import com.norda.product.Grind;
import com.norda.product.Product;
import com.norda.product.ProductMapper;
import com.norda.product.ProductRepository;
import com.norda.product.ProductVariant;
import com.norda.product.ProductVariantRepository;
import com.norda.product.dto.ProductSummaryResponse;
import com.norda.region.Region;
import com.norda.region.RegionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

/**
 * Un producto creado desde el admin nace con 3 variantes en grano (250/500/1000g)
 * generadas con la misma logica de precios que los datos de demo (seccion 31);
 * el admin ajusta el stock inicial desde el modulo de inventario.
 */
@Service
@Transactional
public class AdminProductService {

    private final ProductRepository productRepository;
    private final CountryRepository countryRepository;
    private final RegionRepository regionRepository;
    private final ProducerRepository producerRepository;
    private final FarmRepository farmRepository;
    private final ProductVariantRepository productVariantRepository;
    private final InventoryRepository inventoryRepository;

    public AdminProductService(
            ProductRepository productRepository,
            CountryRepository countryRepository,
            RegionRepository regionRepository,
            ProducerRepository producerRepository,
            FarmRepository farmRepository,
            ProductVariantRepository productVariantRepository,
            InventoryRepository inventoryRepository
    ) {
        this.productRepository = productRepository;
        this.countryRepository = countryRepository;
        this.regionRepository = regionRepository;
        this.producerRepository = producerRepository;
        this.farmRepository = farmRepository;
        this.productVariantRepository = productVariantRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> list() {
        return productRepository.findAll().stream().map(ProductMapper::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public AdminProductDetailResponse get(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Café no encontrado."));
        return AdminProductDetailResponse.from(product);
    }

    public ProductSummaryResponse create(AdminProductRequest request) {
        if (request.sku() == null || request.sku().isBlank() || request.slug() == null || request.slug().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "SKU y slug son obligatorios al crear un café.");
        }
        if (productRepository.existsBySlug(request.slug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un café con ese slug.");
        }

        Product product = new Product(
                request.sku(), request.name(), request.slug(), request.shortDescription(), request.longDescription(),
                resolveCountry(request.countryId()), resolveRegion(request.regionId()),
                resolveProducer(request.producerId()), resolveFarm(request.farmId()), null,
                request.variety(), request.process(), request.altitudeM(), request.roastLevel(),
                request.tastingNotes(), request.acidity(), request.body(), request.sweetness(),
                request.recommendedMethods(), request.status(), request.basePriceCents()
        );
        product = productRepository.save(product);
        generateDefaultVariants(product);

        return ProductMapper.toSummary(product);
    }

    public ProductSummaryResponse update(UUID productId, AdminProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Café no encontrado."));

        product.update(
                request.name(), request.shortDescription(), request.longDescription(),
                resolveCountry(request.countryId()), resolveRegion(request.regionId()),
                resolveProducer(request.producerId()), resolveFarm(request.farmId()), product.getCurrentLot(),
                request.variety(), request.process(), request.altitudeM(), request.roastLevel(),
                request.tastingNotes(), request.acidity(), request.body(), request.sweetness(),
                request.recommendedMethods(), request.status(), request.basePriceCents()
        );

        return ProductMapper.toSummary(product);
    }

    public ProductSummaryResponse archive(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Café no encontrado."));
        product.updateStatus(com.norda.product.ProductStatus.ARCHIVED);
        return ProductMapper.toSummary(product);
    }

    public ProductSummaryResponse activate(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Café no encontrado."));
        product.updateStatus(com.norda.product.ProductStatus.ACTIVE);
        return ProductMapper.toSummary(product);
    }

    private void generateDefaultVariants(Product product) {
        int[] weights = {250, 500, 1000};
        double[] multipliers = {1.0, 1.9, 3.6};
        for (int i = 0; i < weights.length; i++) {
            long priceCents = Math.round(product.getBasePriceCents() * multipliers[i] / 10.0) * 10;
            ProductVariant variant = productVariantRepository.save(new ProductVariant(
                    product, product.getSku() + "-" + weights[i] + "-WB", weights[i], Grind.WHOLE_BEAN, priceCents
            ));
            inventoryRepository.save(new Inventory(variant.getId(), 0, 5));
        }
    }

    private Country resolveCountry(UUID id) {
        return countryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "País no válido."));
    }

    private Region resolveRegion(UUID id) {
        return regionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Región no válida."));
    }

    private Producer resolveProducer(UUID id) {
        return producerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Productor no válido."));
    }

    private Farm resolveFarm(UUID id) {
        return farmRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Finca no válida."));
    }
}
