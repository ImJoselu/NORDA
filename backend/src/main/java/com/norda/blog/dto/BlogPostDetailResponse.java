package com.norda.blog.dto;

import com.norda.blog.BlogCategory;

import java.time.Instant;
import java.util.UUID;

public record BlogPostDetailResponse(
        UUID id,
        String slug,
        String title,
        String excerpt,
        String content,
        BlogCategory category,
        String author,
        Instant publishedAt,
        int readingTimeMinutes
) {
}
