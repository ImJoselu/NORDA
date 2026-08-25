package com.norda.blog;

import com.norda.blog.dto.BlogPostDetailResponse;
import com.norda.blog.dto.BlogPostSummaryResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/journal")
public class BlogController {

    private final BlogPostRepository blogPostRepository;

    public BlogController(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    @GetMapping
    public List<BlogPostSummaryResponse> list(@RequestParam(required = false) BlogCategory category) {
        List<BlogPost> posts = category == null
                ? blogPostRepository.findAllByOrderByPublishedAtDesc()
                : blogPostRepository.findAllByCategoryOrderByPublishedAtDesc(category);
        return posts.stream().map(BlogMapper::toSummary).toList();
    }

    @GetMapping("/{slug}")
    public BlogPostDetailResponse get(@PathVariable String slug) {
        BlogPost post = blogPostRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Artículo no encontrado."));
        return BlogMapper.toDetail(post);
    }
}
