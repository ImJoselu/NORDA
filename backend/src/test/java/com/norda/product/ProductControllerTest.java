package com.norda.product;

import com.norda.AbstractIntegrationTest;
import com.norda.common.web.ApiError;
import com.norda.common.web.PageResponse;
import com.norda.product.dto.ProductDetailResponse;
import com.norda.product.dto.ProductSummaryResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Cubre el catalogo publico (seccion "Catalogo"): listado paginado, detalle por
 * slug con variantes, 404 para slugs desconocidos y filtros combinables. Se
 * apoya en los datos reales sembrados por V4__seed_data.sql (p.ej. el cafe
 * 'colombia-huila-finca-la-esperanza', WASHED/LIGHT de Colombia/Huila).
 */
class ProductControllerTest extends AbstractIntegrationTest {

    private static final String KNOWN_SLUG = "colombia-huila-finca-la-esperanza";

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void listProductsReturnsPaginatedContent() {
        ResponseEntity<PageResponse<ProductSummaryResponse>> response = restTemplate.exchange(
                "/api/products", HttpMethod.GET, HttpEntity.EMPTY,
                new ParameterizedTypeReference<PageResponse<ProductSummaryResponse>>() {
                });

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        PageResponse<ProductSummaryResponse> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.content()).isNotEmpty();
        assertThat(body.totalElements()).isGreaterThanOrEqualTo(body.content().size());
        assertThat(body.size()).isEqualTo(20);
        assertThat(body.page()).isZero();
    }

    @Test
    void productDetailBySlugReturnsFullDetailWithVariants() {
        ResponseEntity<ProductDetailResponse> response = restTemplate.getForEntity(
                "/api/products/" + KNOWN_SLUG, ProductDetailResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProductDetailResponse body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.sku()).isEqualTo("COL-HUI-001");
        assertThat(body.slug()).isEqualTo(KNOWN_SLUG);
        assertThat(body.origin().countrySlug()).isEqualTo("colombia");
        assertThat(body.origin().regionSlug()).isEqualTo("huila");
        assertThat(body.process()).isEqualTo(Process.WASHED);
        assertThat(body.roastLevel()).isEqualTo(RoastLevel.LIGHT);
        assertThat(body.variants()).isNotEmpty();
        assertThat(body.variants()).allSatisfy(variant -> {
            assertThat(variant.id()).isNotNull();
            assertThat(variant.priceCents()).isPositive();
            assertThat(variant.availability()).isNotBlank();
        });
    }

    @Test
    void detailForUnknownSlugReturns404() {
        ResponseEntity<ApiError> response = restTemplate.getForEntity(
                "/api/products/this-slug-does-not-exist-anywhere", ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void filteringByCountryNarrowsResultsToThatCountry() {
        ResponseEntity<PageResponse<ProductSummaryResponse>> response = restTemplate.exchange(
                "/api/products?country=colombia&size=50", HttpMethod.GET, HttpEntity.EMPTY,
                new ParameterizedTypeReference<PageResponse<ProductSummaryResponse>>() {
                });

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        PageResponse<ProductSummaryResponse> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.content()).isNotEmpty();
        assertThat(body.content()).allSatisfy(product -> assertThat(product.countrySlug()).isEqualTo("colombia"));
        assertThat(body.content()).extracting(ProductSummaryResponse::slug).contains(KNOWN_SLUG);
    }

    @Test
    void filteringByRoastAndProcessNarrowsResults() {
        ResponseEntity<PageResponse<ProductSummaryResponse>> response = restTemplate.exchange(
                "/api/products?roast=LIGHT&process=WASHED&size=50", HttpMethod.GET, HttpEntity.EMPTY,
                new ParameterizedTypeReference<PageResponse<ProductSummaryResponse>>() {
                });

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        PageResponse<ProductSummaryResponse> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.content()).isNotEmpty();
        assertThat(body.content()).allSatisfy(product -> {
            assertThat(product.roastLevel()).isEqualTo(RoastLevel.LIGHT);
            assertThat(product.process()).isEqualTo(Process.WASHED);
        });
        assertThat(body.content()).extracting(ProductSummaryResponse::slug).contains(KNOWN_SLUG);
    }

    @Test
    void filteringByUnknownCountryReturnsEmptyContent() {
        ResponseEntity<PageResponse<ProductSummaryResponse>> response = restTemplate.exchange(
                "/api/products?country=not-a-real-country-slug", HttpMethod.GET, HttpEntity.EMPTY,
                new ParameterizedTypeReference<PageResponse<ProductSummaryResponse>>() {
                });

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().content()).isEmpty();
    }
}
