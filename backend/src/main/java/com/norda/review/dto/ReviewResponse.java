package com.norda.review.dto;

import java.time.Instant;
import java.util.UUID;

public record ReviewResponse(
        UUID id,
        String authorName,
        int rating,
        String title,
        String comment,
        Instant createdAt
) {
}
