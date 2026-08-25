package com.norda.admin.dto;

import com.norda.review.ReviewStatus;

import java.time.Instant;
import java.util.UUID;

public record AdminReviewResponse(
        UUID id,
        UUID productId,
        String productName,
        String customerName,
        int rating,
        String title,
        String comment,
        ReviewStatus status,
        Instant createdAt
) {
}
