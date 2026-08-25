package com.norda.cart;

import com.norda.AbstractIntegrationTest;
import com.norda.auth.dto.AuthResponse;
import com.norda.cart.dto.CartResponse;
import com.norda.common.web.ApiError;
import com.norda.product.Grind;
import com.norda.product.dto.ProductDetailResponse;
import com.norda.product.dto.ProductVariantResponse;
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
 * Flujo del carrito (seccion "Carrito"): anadir items, totales calculados,
 * aplicar/retirar cupon y las reglas de autenticacion. Usa el cafe sembrado
 * 'colombia-huila-finca-la-esperanza' y los cupones reales NORDA10 (10%, sin
 * minimo) y WELCOME15 (15%, minimo 2000 centimos) de V9__coupons.sql.
 */
class CartControllerTest extends AbstractIntegrationTest {

    private static final String PRODUCT_SLUG = "colombia-huila-finca-la-esperanza";

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void addingCartItemWithoutAuthReturnsUnauthorized() {
        ResponseEntity<ApiError> response = restTemplate.postForEntity(
                "/api/cart/items", Map.of("productVariantId", UUID.randomUUID(), "quantity", 1), ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void addingItemToCartComputesItemCountAndSubtotal() {
        String token = registerAndGetToken();
        ProductVariantResponse variant = findVariant(PRODUCT_SLUG, 250, Grind.WHOLE_BEAN);

        CartResponse cart = addItem(token, variant.id(), 2).getBody();

        assertThat(cart).isNotNull();
        assertThat(cart.items()).hasSize(1);
        assertThat(cart.items().get(0).productVariantId()).isEqualTo(variant.id());
        assertThat(cart.items().get(0).productSlug()).isEqualTo(PRODUCT_SLUG);
        assertThat(cart.itemCount()).isEqualTo(2);
        assertThat(cart.subtotalCents()).isEqualTo(variant.priceCents() * 2);
        assertThat(cart.couponCode()).isNull();
        assertThat(cart.discountCents()).isZero();
        assertThat(cart.totalCents()).isEqualTo(cart.subtotalCents());
    }

    @Test
    void applyingValidCouponAppliesDiscountToCart() {
        String token = registerAndGetToken();
        ProductVariantResponse variant = findVariant(PRODUCT_SLUG, 250, Grind.WHOLE_BEAN);
        addItem(token, variant.id(), 2);

        ResponseEntity<CartResponse> response = restTemplate.exchange(
                "/api/cart/coupon", HttpMethod.POST,
                new HttpEntity<>(Map.of("code", "NORDA10"), authHeaders(token)), CartResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        CartResponse cart = response.getBody();
        assertThat(cart).isNotNull();
        long expectedSubtotal = variant.priceCents() * 2;
        long expectedDiscount = Math.round(expectedSubtotal * 0.10);
        assertThat(cart.couponCode()).isEqualTo("NORDA10");
        assertThat(cart.subtotalCents()).isEqualTo(expectedSubtotal);
        assertThat(cart.discountCents()).isEqualTo(expectedDiscount);
        assertThat(cart.totalCents()).isEqualTo(expectedSubtotal - expectedDiscount);
    }

    @Test
    void removingCouponClearsDiscount() {
        String token = registerAndGetToken();
        ProductVariantResponse variant = findVariant(PRODUCT_SLUG, 250, Grind.WHOLE_BEAN);
        addItem(token, variant.id(), 2);
        restTemplate.exchange(
                "/api/cart/coupon", HttpMethod.POST,
                new HttpEntity<>(Map.of("code", "NORDA10"), authHeaders(token)), CartResponse.class);

        ResponseEntity<CartResponse> response = restTemplate.exchange(
                "/api/cart/coupon", HttpMethod.DELETE, new HttpEntity<>(authHeaders(token)), CartResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        CartResponse cart = response.getBody();
        assertThat(cart).isNotNull();
        assertThat(cart.couponCode()).isNull();
        assertThat(cart.discountCents()).isZero();
        assertThat(cart.totalCents()).isEqualTo(cart.subtotalCents());
    }

    @Test
    void applyingUnknownCouponCodeReturnsNotFound() {
        String token = registerAndGetToken();
        ProductVariantResponse variant = findVariant(PRODUCT_SLUG, 250, Grind.WHOLE_BEAN);
        addItem(token, variant.id(), 1);

        ResponseEntity<ApiError> response = restTemplate.exchange(
                "/api/cart/coupon", HttpMethod.POST,
                new HttpEntity<>(Map.of("code", "NOT-A-REAL-CODE"), authHeaders(token)), ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void applyingCouponBelowMinimumPurchaseReturnsBadRequest() {
        // WELCOME15 exige min_purchase_cents = 2000; un unico 250g (1250 cents) se queda corto.
        String token = registerAndGetToken();
        ProductVariantResponse variant = findVariant(PRODUCT_SLUG, 250, Grind.WHOLE_BEAN);
        addItem(token, variant.id(), 1);

        ResponseEntity<ApiError> response = restTemplate.exchange(
                "/api/cart/coupon", HttpMethod.POST,
                new HttpEntity<>(Map.of("code", "WELCOME15"), authHeaders(token)), ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<CartResponse> addItem(String token, UUID variantId, int quantity) {
        ResponseEntity<CartResponse> response = restTemplate.exchange(
                "/api/cart/items", HttpMethod.POST,
                new HttpEntity<>(Map.of("productVariantId", variantId, "quantity", quantity), authHeaders(token)),
                CartResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        return response;
    }

    private ProductVariantResponse findVariant(String slug, int weightGrams, Grind grind) {
        ProductDetailResponse detail = restTemplate.getForEntity(
                "/api/products/" + slug, ProductDetailResponse.class).getBody();
        assertThat(detail).isNotNull();
        return detail.variants().stream()
                .filter(v -> v.weightGrams() == weightGrams && v.grind() == grind)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Variante no encontrada en datos semilla: " + slug));
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
        return "cart-" + UUID.randomUUID() + "@example.com";
    }
}
