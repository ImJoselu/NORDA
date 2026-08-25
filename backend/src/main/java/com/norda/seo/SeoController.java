package com.norda.seo;

import com.norda.blog.BlogPostRepository;
import com.norda.country.CountryRepository;
import com.norda.product.ProductRepository;
import com.norda.product.ProductStatus;
import com.norda.region.RegionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.time.ZoneOffset;
import java.util.stream.Stream;

/**
 * sitemap.xml y robots.txt se generan en el backend (no en el SPA estatico) porque
 * enumeran slugs reales de la base de datos y deben ser legibles sin ejecutar JS
 * (ver ADR-007: la SPA usa meta tags client-side via react-helmet-async para
 * title/description/OG, pero sitemap/robots son estaticos por naturaleza y
 * el backend es la unica fuente de verdad de que slugs existen).
 */
@RestController
public class SeoController {

    private final ProductRepository productRepository;
    private final CountryRepository countryRepository;
    private final RegionRepository regionRepository;
    private final BlogPostRepository blogPostRepository;
    private final String frontendUrl;

    public SeoController(
            ProductRepository productRepository,
            CountryRepository countryRepository,
            RegionRepository regionRepository,
            BlogPostRepository blogPostRepository,
            @Value("${app.frontend-url}") String frontendUrl
    ) {
        this.productRepository = productRepository;
        this.countryRepository = countryRepository;
        this.regionRepository = regionRepository;
        this.blogPostRepository = blogPostRepository;
        this.frontendUrl = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
    }

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String sitemap() {
        String today = DateTimeFormatter.ISO_LOCAL_DATE.format(java.time.Instant.now().atZone(ZoneOffset.UTC));

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        Stream.of("", "/coffee", "/origins", "/journal", "/finder")
                .forEach(path -> appendUrl(xml, path, today, "weekly", path.isEmpty() ? "1.0" : "0.8"));

        productRepository.findAllByStatus(ProductStatus.ACTIVE)
                .forEach(product -> appendUrl(xml, "/coffee/" + product.getSlug(), today, "monthly", "0.7"));

        countryRepository.findAllByOrderByNameAsc()
                .forEach(country -> appendUrl(xml, "/origins/" + country.getSlug(), today, "monthly", "0.6"));

        regionRepository.findAll()
                .forEach(region -> appendUrl(
                        xml, "/origins/" + region.getCountry().getSlug() + "/" + region.getSlug(), today, "monthly", "0.6"
                ));

        blogPostRepository.findAllByOrderByPublishedAtDesc()
                .forEach(post -> appendUrl(xml, "/journal/" + post.getSlug(), today, "yearly", "0.5"));

        xml.append("</urlset>\n");
        return xml.toString();
    }

    @GetMapping(value = "/robots.txt", produces = "text/plain")
    public String robots() {
        return """
                User-agent: *
                Allow: /
                Disallow: /account
                Disallow: /checkout
                Disallow: /admin

                Sitemap: %s/sitemap.xml
                """.formatted(frontendUrl);
    }

    private void appendUrl(StringBuilder xml, String path, String lastmod, String changefreq, String priority) {
        xml.append("  <url>\n");
        xml.append("    <loc>").append(frontendUrl).append(path).append("</loc>\n");
        xml.append("    <lastmod>").append(lastmod).append("</lastmod>\n");
        xml.append("    <changefreq>").append(changefreq).append("</changefreq>\n");
        xml.append("    <priority>").append(priority).append("</priority>\n");
        xml.append("  </url>\n");
    }
}
