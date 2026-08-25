package com.norda.auth;

import com.norda.AbstractIntegrationTest;
import com.norda.auth.dto.AuthResponse;
import com.norda.common.web.ApiError;
import com.norda.user.dto.UserSummaryResponse;
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

class AuthControllerTest extends AbstractIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void registerCreatesUserAndReturnsAccessToken() {
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
                "/api/auth/register", registerPayload(uniqueEmail()), AuthResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().accessToken()).isNotBlank();
        assertThat(response.getBody().user().roles()).containsExactly("CUSTOMER");
        assertThat(response.getHeaders().get(HttpHeaders.SET_COOKIE)).isNotNull();
    }

    @Test
    void registerWithDuplicateEmailReturnsConflict() {
        String email = uniqueEmail();
        restTemplate.postForEntity("/api/auth/register", registerPayload(email), AuthResponse.class);

        ResponseEntity<ApiError> response = restTemplate.postForEntity(
                "/api/auth/register", registerPayload(email), ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void loginWithWrongPasswordReturnsUnauthorized() {
        String email = uniqueEmail();
        restTemplate.postForEntity("/api/auth/register", registerPayload(email), AuthResponse.class);

        ResponseEntity<ApiError> response = restTemplate.postForEntity(
                "/api/auth/login", Map.of("email", email, "password", "wrong-password"), ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void meWithoutTokenIsRejected() {
        ResponseEntity<ApiError> response = restTemplate.getForEntity("/api/users/me", ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void meWithValidTokenReturnsCurrentUser() {
        String email = uniqueEmail();
        AuthResponse registerBody = restTemplate.postForEntity(
                "/api/auth/register", registerPayload(email), AuthResponse.class).getBody();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(registerBody.accessToken());

        ResponseEntity<UserSummaryResponse> response = restTemplate.exchange(
                "/api/users/me", HttpMethod.GET, new HttpEntity<>(headers), UserSummaryResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().email()).isEqualTo(email);
    }

    private Map<String, String> registerPayload(String email) {
        return Map.of(
                "email", email,
                "password", "password123",
                "firstName", "Ana",
                "lastName", "Diaz"
        );
    }

    private String uniqueEmail() {
        return "user-" + UUID.randomUUID() + "@example.com";
    }
}
