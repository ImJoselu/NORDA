package com.norda.admin;

import com.norda.admin.dto.AdminReviewResponse;
import com.norda.product.Product;
import com.norda.product.ProductRepository;
import com.norda.review.Review;
import com.norda.review.ReviewRepository;
import com.norda.user.User;
import com.norda.user.UserRepository;
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
public class AdminReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public AdminReviewService(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminReviewResponse> list() {
        List<Review> reviews = reviewRepository.findAllByOrderByCreatedAtDesc();

        Map<UUID, Product> productsById = productRepository.findAllById(reviews.stream().map(Review::getProductId).distinct().toList())
                .stream().collect(Collectors.toMap(Product::getId, p -> p));
        Map<UUID, User> usersById = userRepository.findAllById(reviews.stream().map(Review::getUserId).distinct().toList())
                .stream().collect(Collectors.toMap(User::getId, u -> u));

        return reviews.stream().map(r -> {
            Product product = productsById.get(r.getProductId());
            User user = usersById.get(r.getUserId());
            return new AdminReviewResponse(
                    r.getId(), r.getProductId(), product != null ? product.getName() : "—",
                    user != null ? user.getFirstName() + " " + user.getLastName() : "—",
                    r.getRating(), r.getTitle(), r.getComment(), r.getStatus(), r.getCreatedAt()
            );
        }).toList();
    }

    public void hide(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reseña no encontrada."));
        review.hide();
    }

    public void restore(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reseña no encontrada."));
        review.restore();
    }
}
