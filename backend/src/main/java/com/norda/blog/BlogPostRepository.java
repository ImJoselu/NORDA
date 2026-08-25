package com.norda.blog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BlogPostRepository extends JpaRepository<BlogPost, java.util.UUID> {

    List<BlogPost> findAllByOrderByPublishedAtDesc();

    List<BlogPost> findAllByCategoryOrderByPublishedAtDesc(BlogCategory category);

    Optional<BlogPost> findBySlug(String slug);
}
