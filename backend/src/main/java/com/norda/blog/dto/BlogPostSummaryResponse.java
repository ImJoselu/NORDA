package com.norda.blog.dto;

import com.norda.blog.BlogCategory;

import java.time.Instant;
import java.util.UUID;

public record BlogPostSummaryResponse(
        UUID id,
        String slug,
        String title,
        String excerpt,
        BlogCategory category,
        String author,
        Instant publishedAt,
        int readingTimeMinutes
) {
}
