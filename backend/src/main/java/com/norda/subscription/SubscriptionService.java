package com.norda.subscription;

import com.norda.country.Country;
import com.norda.country.CountryRepository;
import com.norda.product.Product;
import com.norda.product.ProductRepository;
import com.norda.subscription.dto.CreateSubscriptionRequest;
import com.norda.subscription.dto.SubscriptionResponse;
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
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final ProductRepository productRepository;
    private final CountryRepository countryRepository;

    public SubscriptionService(
            SubscriptionRepository subscriptionRepository,
            ProductRepository productRepository,
            CountryRepository countryRepository
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.productRepository = productRepository;
        this.countryRepository = countryRepository;
    }

    @Transactional(readOnly = true)
    public List<SubscriptionResponse> list(UUID userId) {
        return subscriptionRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public SubscriptionResponse create(UUID userId, CreateSubscriptionRequest request) {
        UUID originCountryId = validateAndResolveOriginCountry(request.type(), request.originCountrySlug());

        Subscription subscription = new Subscription(
                userId, request.coffeeCount(), request.frequency(), request.type(), originCountryId
        );

        for (UUID productId : resolveFixedProductIds(request.type(), request.fixedProductIds(), request.coffeeCount())) {
            subscription.addItem(new SubscriptionItem(productId));
        }

        return toResponse(subscriptionRepository.save(subscription));
    }

    public SubscriptionResponse update(UUID userId, UUID subscriptionId, CreateSubscriptionRequest request) {
        Subscription subscription = require(userId, subscriptionId);

        UUID originCountryId = validateAndResolveOriginCountry(request.type(), request.originCountrySlug());
        subscription.update(request.coffeeCount(), request.frequency(), request.type(), originCountryId);

        subscription.clearItems();
        for (UUID productId : resolveFixedProductIds(request.type(), request.fixedProductIds(), request.coffeeCount())) {
            subscription.addItem(new SubscriptionItem(productId));
        }

        return toResponse(subscription);
    }

    public SubscriptionResponse pause(UUID userId, UUID subscriptionId) {
        Subscription subscription = require(userId, subscriptionId);
        subscription.pause();
        return toResponse(subscription);
    }

    public SubscriptionResponse resume(UUID userId, UUID subscriptionId) {
        Subscription subscription = require(userId, subscriptionId);
        subscription.resume();
        return toResponse(subscription);
    }

    public SubscriptionResponse cancel(UUID userId, UUID subscriptionId) {
        Subscription subscription = require(userId, subscriptionId);
        subscription.cancel();
        return toResponse(subscription);
    }

    public SubscriptionResponse skipNext(UUID userId, UUID subscriptionId) {
        Subscription subscription = require(userId, subscriptionId);
        subscription.skipNext();
        return toResponse(subscription);
    }

    private Subscription require(UUID userId, UUID subscriptionId) {
        return subscriptionRepository.findByIdAndUserId(subscriptionId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Suscripción no encontrada."));
    }

    private UUID validateAndResolveOriginCountry(SubscriptionType type, String originCountrySlug) {
        if (type != SubscriptionType.ORIGIN_DISCOVERY) {
            return null;
        }
        if (originCountrySlug == null || originCountrySlug.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecciona un país de origen válido.");
        }
        return countryRepository.findBySlug(originCountrySlug)
                .map(Country::getId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecciona un país de origen válido."));
    }

    private List<UUID> resolveFixedProductIds(SubscriptionType type, List<UUID> fixedProductIds, int coffeeCount) {
        if (type != SubscriptionType.FIXED) {
            return List.of();
        }
        if (fixedProductIds == null || fixedProductIds.size() != coffeeCount) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Elige exactamente " + coffeeCount + " café(s) fijo(s).");
        }
        long validCount = productRepository.findAllById(fixedProductIds).size();
        if (validCount != fixedProductIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Alguno de los cafés seleccionados no existe.");
        }
        return fixedProductIds;
    }

    private SubscriptionResponse toResponse(Subscription subscription) {
        String originCountryName = null;
        if (subscription.getOriginCountryId() != null) {
            originCountryName = countryRepository.findById(subscription.getOriginCountryId())
                    .map(Country::getName)
                    .orElse(null);
        }

        Map<UUID, Product> productsById = productRepository.findAllById(
                subscription.getItems().stream().map(SubscriptionItem::getProductId).toList()
        ).stream().collect(Collectors.toMap(Product::getId, p -> p));

        List<SubscriptionResponse.SubscriptionItemResponse> items = subscription.getItems().stream()
                .map(item -> {
                    Product product = productsById.get(item.getProductId());
                    return new SubscriptionResponse.SubscriptionItemResponse(
                            item.getProductId(),
                            product != null ? product.getName() : "Café no disponible",
                            product != null ? product.getSlug() : null
                    );
                })
                .toList();

        return new SubscriptionResponse(
                subscription.getId(), subscription.getStatus(), subscription.getCoffeeCount(),
                subscription.getFrequency(), subscription.getType(), originCountryName,
                subscription.getNextDeliveryDate(), items
        );
    }
}
