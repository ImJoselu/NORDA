package com.norda.favorite;

import com.norda.AbstractIntegrationTest;
import com.norda.auth.dto.AuthResponse;
import com.norda.common.web.ApiError;
import com.norda.product.dto.ProductDetailResponse;
import com.norda.product.dto.ProductSummaryResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Favoritos (seccion correspondiente del backlog): anadir/listar/retirar y las
 * reglas de autenticacion. FavoriteController identifica el producto por su
 * UUID (no por slug), asi que primero se resuelve el id real via el detalle
 * publico del catalogo.
 */
class FavoriteControllerTest extends AbstractIntegrationTest {

    private static final String PRODUCT_SLUG = "brasil-sul-de-minas-fazenda-santa-ines";

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void listingFavoritesWithoutAuthReturnsUnauthorized() {
        ResponseEntity<ApiError> response = restTemplate.getForEntity("/api/favorites", ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void addingFavoriteWithoutAuthReturnsUnauthorized() {
        ResponseEntity<ApiError> response = restTemplate.exchange(
                "/api/favorites/" + UUID.randomUUID(), HttpMethod.POST, HttpEntity.EMPTY, ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void addingFavoriteMakesItAppearInList() {
        String token = registerAndGetToken();
        UUID productId = resolveProductId(PRODUCT_SLUG);

        ResponseEntity<Void> addResponse = restTemplate.exchange(
                "/api/favorites/" + productId, HttpMethod.POST, new HttpEntity<>(authHeaders(token)), Void.class);
        assertThat(addResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        List<ProductSummaryResponse> favorites = listFavorites(token);
        assertThat(favorites).extracting(ProductSummaryResponse::id).contains(productId);
        assertThat(favorites).extracting(ProductSummaryResponse::slug).contains(PRODUCT_SLUG);
    }

    @Test
    void removingFavoriteMakesItDisappearFromList() {
        String token = registerAndGetToken();
        UUID productId = resolveProductId(PRODUCT_SLUG);
        restTemplate.exchange(
                "/api/favorites/" + productId, HttpMethod.POST, new HttpEntity<>(authHeaders(token)), Void.class);

        ResponseEntity<Void> removeResponse = restTemplate.exchange(
                "/api/favorites/" + productId, HttpMethod.DELETE, new HttpEntity<>(authHeaders(token)), Void.class);
        assertThat(removeResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        List<ProductSummaryResponse> favorites = listFavorites(token);
        assertThat(favorites).extracting(ProductSummaryResponse::id).doesNotContain(productId);
    }

    private List<ProductSummaryResponse> listFavorites(String token) {
        ResponseEntity<List<ProductSummaryResponse>> response = restTemplate.exchange(
                "/api/favorites", HttpMethod.GET, new HttpEntity<>(authHeaders(token)),
                new ParameterizedTypeReference<List<ProductSummaryResponse>>() {
                });
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        return response.getBody();
    }

    private UUID resolveProductId(String slug) {
        ProductDetailResponse detail = restTemplate.getForEntity("/api/products/" + slug, ProductDetailResponse.class).getBody();
        assertThat(detail).isNotNull();
        return detail.id();
    }

    private HttpHeaders authHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        return headers;
    }

    private String registerAndGetToken() {
        String email = uniqueEmail();
        AuthResponse body = restTemplate.postForEntity(
                "/api/auth/register",
                Map.of("email", email, "password", "password123", "firstName", "Ana", "lastName", "Diaz"),
                AuthResponse.class).getBody();
        assertThat(body).isNotNull();
        return body.accessToken();
    }

    private String uniqueEmail() {
        return "favorite-" + UUID.randomUUID() + "@example.com";
    }
}
