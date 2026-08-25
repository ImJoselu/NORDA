package com.norda.order;

import com.norda.AbstractIntegrationTest;
import com.norda.auth.dto.AuthResponse;
import com.norda.common.web.ApiError;
import com.norda.order.dto.CheckoutRequest;
import com.norda.order.dto.OrderResponse;
import com.norda.order.dto.OrderSummaryResponse;
import com.norda.product.Grind;
import com.norda.product.dto.ProductDetailResponse;
import com.norda.product.dto.ProductVariantResponse;
import com.norda.shipping.ShippingMethod;
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
 * Checkout de extremo a extremo a nivel HTTP (secciones 25/28): registro, carrito,
 * POST /api/checkout, y verificacion via GET /api/orders y GET /api/orders/{id}.
 * El pago pasa por DemoPaymentService, que siempre resuelve con exito de forma
 * sincrona (ver DemoPaymentService.charge), asi que el estado PAID es
 * determinista y no depende de ningun mecanismo aleatorio.
 *
 * Usa 'colombia-narino-finca-el-mirador' (distinto del producto usado en
 * CartControllerTest) con la variante de 1000g/WHOLE_BEAN, cuyo stock sembrado
 * es exactamente 20 unidades (V4__seed_data.sql): comprar la cantidad maxima
 * permitida por item (20) agota el stock por completo y permite comprobar en la
 * frontera HTTP que la disponibilidad pasa de IN_STOCK a OUT_OF_STOCK.
 */
class CheckoutFlowTest extends AbstractIntegrationTest {

    private static final String PRODUCT_SLUG = "colombia-narino-finca-el-mirador";

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void checkoutWithEmptyCartReturnsBadRequest() {
        String token = registerAndGetToken();

        ResponseEntity<ApiError> response = restTemplate.exchange(
                "/api/checkout", HttpMethod.POST,
                new HttpEntity<>(validCheckoutRequest(), authHeaders(token)), ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void fullCheckoutFlowPaysOrderDecrementsStockAndAppearsInOrderHistory() {
        String token = registerAndGetToken();
        ProductVariantResponse variant = findVariant(PRODUCT_SLUG, 1000, Grind.WHOLE_BEAN);
        assertThat(variant.availability()).isEqualTo("IN_STOCK");

        addItem(token, variant.id(), 20);

        ResponseEntity<OrderResponse> checkoutResponse = restTemplate.exchange(
                "/api/checkout", HttpMethod.POST,
                new HttpEntity<>(validCheckoutRequest(), authHeaders(token)), OrderResponse.class);

        assertThat(checkoutResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        OrderResponse order = checkoutResponse.getBody();
        assertThat(order).isNotNull();
        assertThat(order.status()).isEqualTo(OrderStatus.PAID);
        assertThat(order.items()).hasSize(1);
        assertThat(order.items().get(0).quantity()).isEqualTo(20);
        long expectedSubtotal = variant.priceCents() * 20;
        assertThat(order.subtotalCents()).isEqualTo(expectedSubtotal);
        assertThat(order.shippingCents()).isZero(); // por encima del umbral de envio gratis (3500 centimos)
        assertThat(order.discountCents()).isZero();
        assertThat(order.totalCents()).isEqualTo(expectedSubtotal);

        // El stock reservado se confirma (commit) al pagar: 20 de 20 unidades sembradas -> sin disponibilidad.
        ProductVariantResponse variantAfter = findVariant(PRODUCT_SLUG, 1000, Grind.WHOLE_BEAN);
        assertThat(variantAfter.availability()).isEqualTo("OUT_OF_STOCK");

        ResponseEntity<List<OrderSummaryResponse>> listResponse = restTemplate.exchange(
                "/api/orders", HttpMethod.GET, new HttpEntity<>(authHeaders(token)),
                new ParameterizedTypeReference<List<OrderSummaryResponse>>() {
                });
        assertThat(listResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(listResponse.getBody()).isNotNull();
        assertThat(listResponse.getBody())
                .extracting(OrderSummaryResponse::id)
                .contains(order.id());

        ResponseEntity<OrderResponse> getResponse = restTemplate.exchange(
                "/api/orders/" + order.id(), HttpMethod.GET, new HttpEntity<>(authHeaders(token)), OrderResponse.class);
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody()).isNotNull();
        assertThat(getResponse.getBody().id()).isEqualTo(order.id());
        assertThat(getResponse.getBody().status()).isEqualTo(OrderStatus.PAID);
        assertThat(getResponse.getBody().orderNumber()).isEqualTo(order.orderNumber());
    }

    @Test
    void gettingAnotherUsersOrderReturnsNotFound() {
        String ownerToken = registerAndGetToken();
        ProductVariantResponse variant = findVariant(PRODUCT_SLUG, 250, Grind.WHOLE_BEAN);
        addItem(ownerToken, variant.id(), 1);
        OrderResponse order = restTemplate.exchange(
                "/api/checkout", HttpMethod.POST,
                new HttpEntity<>(validCheckoutRequest(), authHeaders(ownerToken)), OrderResponse.class).getBody();
        assertThat(order).isNotNull();

        String otherToken = registerAndGetToken();

        ResponseEntity<ApiError> response = restTemplate.exchange(
                "/api/orders/" + order.id(), HttpMethod.GET, new HttpEntity<>(authHeaders(otherToken)), ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    private CheckoutRequest validCheckoutRequest() {
        ShippingAddress address = new ShippingAddress(
                "Ana Diaz", "Calle Mayor 12", null, "Madrid", "Madrid", "28013", "España", "600111222");
        return new CheckoutRequest(address, ShippingMethod.STANDARD);
    }

    private void addItem(String token, UUID variantId, int quantity) {
        ResponseEntity<Object> response = restTemplate.exchange(
                "/api/cart/items", HttpMethod.POST,
                new HttpEntity<>(Map.of("productVariantId", variantId, "quantity", quantity), authHeaders(token)),
                Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
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
        return "checkout-" + UUID.randomUUID() + "@example.com";
    }
}
