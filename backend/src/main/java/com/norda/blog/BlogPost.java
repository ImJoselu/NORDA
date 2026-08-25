package com.norda.blog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "blog_posts")
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String excerpt;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BlogCategory category;

    @Column(nullable = false)
    private String author;

    @Column(name = "published_at", nullable = false)
    private Instant publishedAt;

    protected BlogPost() {
        // JPA
    }

    public BlogPost(String slug, String title, String excerpt, String content, BlogCategory category, String author, Instant publishedAt) {
        this.slug = slug;
        this.title = title;
        this.excerpt = excerpt;
        this.content = content;
        this.category = category;
        this.author = author;
        this.publishedAt = publishedAt;
    }

    public UUID getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getTitle() {
        return title;
    }

    public String getExcerpt() {
        return excerpt;
    }

    public String getContent() {
        return content;
    }

    public BlogCategory getCategory() {
        return category;
    }

    public String getAuthor() {
        return author;
    }

    public Instant getPublishedAt() {
        return publishedAt;
    }
}
