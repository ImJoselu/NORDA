package com.norda.favorite;

import com.norda.product.Product;
import com.norda.product.ProductMapper;
import com.norda.product.ProductRepository;
import com.norda.product.dto.ProductSummaryResponse;
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
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, ProductRepository productRepository) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> list(UUID userId) {
        List<Favorite> favorites = favoriteRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        Map<UUID, Product> productsById = productRepository.findAllById(
                favorites.stream().map(Favorite::getProductId).toList()
        ).stream().collect(Collectors.toMap(Product::getId, p -> p));

        return favorites.stream()
                .map(favorite -> productsById.get(favorite.getProductId()))
                .filter(product -> product != null)
                .map(ProductMapper::toSummary)
                .toList();
    }

    public void add(UUID userId, UUID productId) {
        if (favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            return;
        }
        if (!productRepository.existsById(productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Café no encontrado.");
        }
        favoriteRepository.save(new Favorite(userId, productId));
    }

    public void remove(UUID userId, UUID productId) {
        favoriteRepository.findByUserIdAndProductId(userId, productId).ifPresent(favoriteRepository::delete);
    }
}
