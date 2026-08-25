package com.norda.review;

import com.norda.common.security.CurrentUser;
import com.norda.review.dto.CreateReviewRequest;
import com.norda.review.dto.ProductReviewsResponse;
import com.norda.review.dto.ReviewResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products/{slug}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ProductReviewsResponse list(@PathVariable String slug) {
        return reviewService.list(slug);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse create(
            Authentication authentication,
            @PathVariable String slug,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        return reviewService.create(CurrentUser.id(authentication), slug, request);
    }
}
