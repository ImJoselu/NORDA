package com.norda.review;

import com.norda.AbstractIntegrationTest;
import com.norda.auth.dto.AuthResponse;
import com.norda.common.web.ApiError;
import com.norda.order.ShippingAddress;
import com.norda.order.dto.CheckoutRequest;
import com.norda.order.dto.OrderResponse;
import com.norda.product.Grind;
import com.norda.product.dto.ProductDetailResponse;
import com.norda.product.dto.ProductVariantResponse;
import com.norda.review.dto.ProductReviewsResponse;
import com.norda.review.dto.ReviewResponse;
import com.norda.shipping.ShippingMethod;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Resenas (seccion 24): "solo usuarios que hayan comprado" pueden escribir una
 * resena (ReviewService.hasPurchased exige un pedido con ese producto en estado
 * PAID/PROCESSING/SHIPPED/DELIVERED), y solo una resena por usuario y producto.
 * Usa 'etiopia-yirgacheffe-estacion-konga' (distinto de los productos usados en
 * CartControllerTest/CheckoutFlowTest para no interferir con sus aserciones de
 * stock) y realiza una compra real via /api/checkout para satisfacer esa regla.
 */
class ReviewControllerTest extends AbstractIntegrationTest {

    private static final String PRODUCT_SLUG = "etiopia-yirgacheffe-estacion-konga";

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void postingReviewWithoutAuthReturnsUnauthorized() {
        ResponseEntity<ApiError> response = restTemplate.postForEntity(
                "/api/products/" + PRODUCT_SLUG + "/reviews",
                Map.of("rating", 5, "title", "Genial", "comment", "Muy buen cafe."), ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void postingReviewWithoutHavingPurchasedIsForbidden() {
        String token = registerAndGetToken();

        ResponseEntity<ApiError> response = restTemplate.exchange(
                "/api/products/" + PRODUCT_SLUG + "/reviews", HttpMethod.POST,
                new HttpEntity<>(Map.of("rating", 5, "title", "Genial", "comment", "Muy buen cafe."), authHeaders(token)),
                ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void postingReviewAfterPurchaseSucceedsAndAppearsInProductReviews() {
        String token = registerAndGetToken();
        buyProduct(token);

        ResponseEntity<ReviewResponse> createResponse = restTemplate.exchange(
                "/api/products/" + PRODUCT_SLUG + "/reviews", HttpMethod.POST,
                new HttpEntity<>(Map.of("rating", 5, "title", "Excelente taza", "comment", "Aroma intenso y dulzor a fruta."),
                        authHeaders(token)),
                ReviewResponse.class);

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        ReviewResponse created = createResponse.getBody();
        assertThat(created).isNotNull();
        assertThat(created.rating()).isEqualTo(5);
        assertThat(created.title()).isEqualTo("Excelente taza");
        assertThat(created.authorName()).isNotBlank();

        ResponseEntity<ProductReviewsResponse> listResponse = restTemplate.getForEntity(
                "/api/products/" + PRODUCT_SLUG + "/reviews", ProductReviewsResponse.class);

        assertThat(listResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        ProductReviewsResponse reviews = listResponse.getBody();
        assertThat(reviews).isNotNull();
        assertThat(reviews.reviewCount()).isGreaterThanOrEqualTo(1);
        assertThat(reviews.reviews()).extracting(ReviewResponse::id).contains(created.id());
    }

    @Test
    void postingSecondReviewForSameProductIsRejectedAsConflict() {
        String token = registerAndGetToken();
        buyProduct(token);

        restTemplate.exchange(
                "/api/products/" + PRODUCT_SLUG + "/reviews", HttpMethod.POST,
                new HttpEntity<>(Map.of("rating", 4, "title", "Buena", "comment", "Correcto en general."), authHeaders(token)),
                ReviewResponse.class);

        ResponseEntity<ApiError> secondResponse = restTemplate.exchange(
                "/api/products/" + PRODUCT_SLUG + "/reviews", HttpMethod.POST,
                new HttpEntity<>(Map.of("rating", 3, "title", "Otra vez", "comment", "Repito opinion."), authHeaders(token)),
                ApiError.class);

        assertThat(secondResponse.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }

    private void buyProduct(String token) {
        ProductDetailResponse detail = restTemplate.getForEntity(
                "/api/products/" + PRODUCT_SLUG, ProductDetailResponse.class).getBody();
        assertThat(detail).isNotNull();
        ProductVariantResponse variant = detail.variants().stream()
                .filter(v -> v.weightGrams() == 250 && v.grind() == Grind.WHOLE_BEAN)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Variante no encontrada en datos semilla: " + PRODUCT_SLUG));

        ResponseEntity<Object> addResponse = restTemplate.exchange(
                "/api/cart/items", HttpMethod.POST,
                new HttpEntity<>(Map.of("productVariantId", variant.id(), "quantity", 1), authHeaders(token)),
                Object.class);
        assertThat(addResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        ShippingAddress address = new ShippingAddress(
                "Ana Diaz", "Calle Mayor 12", null, "Madrid", "Madrid", "28013", "España", "600111222");
        CheckoutRequest checkoutRequest = new CheckoutRequest(address, ShippingMethod.STANDARD);

        ResponseEntity<OrderResponse> checkoutResponse = restTemplate.exchange(
                "/api/checkout", HttpMethod.POST, new HttpEntity<>(checkoutRequest, authHeaders(token)), OrderResponse.class);
        assertThat(checkoutResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(checkoutResponse.getBody()).isNotNull();
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
        return "review-" + UUID.randomUUID() + "@example.com";
    }
}
