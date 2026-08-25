package com.norda.review;

import com.norda.order.Order;
import com.norda.order.OrderItem;
import com.norda.order.OrderRepository;
import com.norda.order.OrderStatus;
import com.norda.product.Product;
import com.norda.product.ProductRepository;
import com.norda.product.ProductStatus;
import com.norda.product.ProductVariant;
import com.norda.product.ProductVariantRepository;
import com.norda.review.dto.CreateReviewRequest;
import com.norda.review.dto.ProductReviewsResponse;
import com.norda.review.dto.ReviewResponse;
import com.norda.user.User;
import com.norda.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Solo puede escribir una review quien tenga un pedido con ese producto en un
 * estado igual o posterior a PAID (seccion 24: "solo usuarios que hayan comprado").
 */
@Service
@Transactional
public class ReviewService {

    private static final List<OrderStatus> PURCHASED_STATUSES =
            List.of(OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED);

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            ProductRepository productRepository,
            ProductVariantRepository productVariantRepository,
            OrderRepository orderRepository,
            UserRepository userRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public ProductReviewsResponse list(String productSlug) {
        Product product = findProductBySlug(productSlug);
        List<Review> reviews = reviewRepository.findAllByProductIdAndStatusOrderByCreatedAtDesc(product.getId(), ReviewStatus.VISIBLE);

        List<ReviewResponse> responses = reviews.stream().map(this::toResponse).toList();
        double average = reviewRepository.averageRating(product.getId());
        long count = reviewRepository.countByProductIdAndStatus(product.getId(), ReviewStatus.VISIBLE);

        return new ProductReviewsResponse(Math.round(average * 10) / 10.0, count, responses);
    }

    public ReviewResponse create(UUID userId, String productSlug, CreateReviewRequest request) {
        Product product = findProductBySlug(productSlug);

        if (reviewRepository.findByUserIdAndProductId(userId, product.getId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya has escrito una reseña para este café.");
        }
        if (!hasPurchased(userId, product.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes reseñar cafés que hayas comprado.");
        }

        Review review = reviewRepository.save(
                new Review(product.getId(), userId, request.rating(), request.title(), request.comment())
        );

        return toResponse(review);
    }

    private boolean hasPurchased(UUID userId, UUID productId) {
        List<Order> eligibleOrders = orderRepository.findAllByUserIdAndStatusIn(userId, PURCHASED_STATUSES);
        Set<UUID> variantIds = eligibleOrders.stream()
                .flatMap(order -> order.getItems().stream())
                .map(OrderItem::getProductVariantId)
                .collect(Collectors.toSet());

        if (variantIds.isEmpty()) {
            return false;
        }

        return productVariantRepository.findAllById(variantIds).stream()
                .map(ProductVariant::getProduct)
                .map(Product::getId)
                .anyMatch(productId::equals);
    }

    private Product findProductBySlug(String slug) {
        return productRepository.findBySlugAndStatus(slug, ProductStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Café no encontrado."));
    }

    private ReviewResponse toResponse(Review review) {
        String authorName = userRepository.findById(review.getUserId())
                .map(this::displayName)
                .orElse("Cliente NØRDA");
        return new ReviewResponse(review.getId(), authorName, review.getRating(), review.getTitle(), review.getComment(), review.getCreatedAt());
    }

    private String displayName(User user) {
        String lastInitial = user.getLastName().isBlank() ? "" : user.getLastName().charAt(0) + ".";
        return (user.getFirstName() + " " + lastInitial).trim();
    }
}
