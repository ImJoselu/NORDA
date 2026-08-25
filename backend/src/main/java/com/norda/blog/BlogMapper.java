package com.norda.blog;

import com.norda.blog.dto.BlogPostDetailResponse;
import com.norda.blog.dto.BlogPostSummaryResponse;

public final class BlogMapper {

    private static final int WORDS_PER_MINUTE = 200;

    private BlogMapper() {
    }

    public static BlogPostSummaryResponse toSummary(BlogPost post) {
        return new BlogPostSummaryResponse(
                post.getId(), post.getSlug(), post.getTitle(), post.getExcerpt(),
                post.getCategory(), post.getAuthor(), post.getPublishedAt(), readingTimeMinutes(post.getContent())
        );
    }

    public static BlogPostDetailResponse toDetail(BlogPost post) {
        return new BlogPostDetailResponse(
                post.getId(), post.getSlug(), post.getTitle(), post.getExcerpt(), post.getContent(),
                post.getCategory(), post.getAuthor(), post.getPublishedAt(), readingTimeMinutes(post.getContent())
        );
    }

    private static int readingTimeMinutes(String content) {
        int wordCount = content.trim().split("\\s+").length;
        return Math.max(1, Math.round(wordCount / (float) WORDS_PER_MINUTE));
    }
}
