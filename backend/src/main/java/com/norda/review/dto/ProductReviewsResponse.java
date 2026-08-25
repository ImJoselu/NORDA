package com.norda.review.dto;

import java.util.List;

public record ProductReviewsResponse(
        double averageRating,
        long reviewCount,
        List<ReviewResponse> reviews
) {
}
