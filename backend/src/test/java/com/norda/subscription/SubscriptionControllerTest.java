package com.norda.subscription;

import com.norda.AbstractIntegrationTest;
import com.norda.auth.dto.AuthResponse;
import com.norda.common.web.ApiError;
import com.norda.subscription.dto.SubscriptionResponse;
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
 * Suscripciones: creacion y listado por usuario, y las reglas de autenticacion.
 * Se usa el tipo SURPRISE (no requiere originCountrySlug ni fixedProductIds:
 * SubscriptionService solo exige originCountrySlug para ORIGIN_DISCOVERY y
 * fixedProductIds para FIXED), lo que mantiene el payload minimo y evita
 * depender de slugs de pais adicionales.
 */
class SubscriptionControllerTest extends AbstractIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void listingSubscriptionsWithoutAuthReturnsUnauthorized() {
        ResponseEntity<ApiError> response = restTemplate.getForEntity("/api/subscriptions", ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void creatingSubscriptionWithoutAuthReturnsUnauthorized() {
        ResponseEntity<ApiError> response = restTemplate.postForEntity(
                "/api/subscriptions", createSurpriseSubscriptionPayload(), ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void creatingSubscriptionMakesItAppearInList() {
        String token = registerAndGetToken();

        ResponseEntity<SubscriptionResponse> createResponse = restTemplate.exchange(
                "/api/subscriptions", HttpMethod.POST,
                new HttpEntity<>(createSurpriseSubscriptionPayload(), authHeaders(token)), SubscriptionResponse.class);

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        SubscriptionResponse created = createResponse.getBody();
        assertThat(created).isNotNull();
        assertThat(created.status()).isEqualTo(SubscriptionStatus.ACTIVE);
        assertThat(created.coffeeCount()).isEqualTo(1);
        assertThat(created.frequency()).isEqualTo(SubscriptionFrequency.ONE_MONTH);
        assertThat(created.type()).isEqualTo(SubscriptionType.SURPRISE);
        assertThat(created.nextDeliveryDate()).isNotNull();

        ResponseEntity<List<SubscriptionResponse>> listResponse = restTemplate.exchange(
                "/api/subscriptions", HttpMethod.GET, new HttpEntity<>(authHeaders(token)),
                new ParameterizedTypeReference<List<SubscriptionResponse>>() {
                });

        assertThat(listResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(listResponse.getBody()).isNotNull();
        assertThat(listResponse.getBody()).extracting(SubscriptionResponse::id).contains(created.id());
    }

    private Map<String, Object> createSurpriseSubscriptionPayload() {
        return Map.of(
                "coffeeCount", 1,
                "frequency", "ONE_MONTH",
                "type", "SURPRISE"
        );
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
        return "subscription-" + UUID.randomUUID() + "@example.com";
    }
}
