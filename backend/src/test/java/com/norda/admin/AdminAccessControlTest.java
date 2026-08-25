package com.norda.admin;

import com.norda.AbstractIntegrationTest;
import com.norda.auth.dto.AuthResponse;
import com.norda.common.web.ApiError;
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
 * Permisos de administracion (seccion "permisos"): no cubre el CRUD completo de
 * cada endpoint /api/admin/** (eso vive en otros tests), solo prueba la parte
 * negativa del control de acceso, que es lo unico que se puede verificar sin un
 * usuario ADMIN real (no existe endpoint publico para promover a un usuario a
 * ADMIN; eso se hace por acceso directo a BD, fuera del alcance de un test HTTP).
 *
 * SecurityConfig aplica hasRole("ADMIN") sobre "/api/admin/**". Segun el
 * comportamiento estandar de Spring Security con ese filtro:
 *  - Sin token -> el AuthenticationEntryPoint (RestAuthenticationEntryPoint)
 *    responde 401 antes de evaluar la autorizacion.
 *  - Con token valido pero sin el rol ADMIN -> la peticion SI esta autenticada,
 *    por lo que el filtro delega en el AccessDeniedHandler (RestAccessDeniedHandler),
 *    que responde 403, no 401.
 */
class AdminAccessControlTest extends AbstractIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void nonAdminUserIsForbiddenFromAdminDashboard() {
        assertForbiddenForNonAdmin("/api/admin/dashboard");
    }

    @Test
    void nonAdminUserIsForbiddenFromAdminProducts() {
        assertForbiddenForNonAdmin("/api/admin/products");
    }

    @Test
    void nonAdminUserIsForbiddenFromAdminOrders() {
        assertForbiddenForNonAdmin("/api/admin/orders");
    }

    @Test
    void anonymousRequestToAdminDashboardIsUnauthorized() {
        assertUnauthorizedForAnonymous("/api/admin/dashboard");
    }

    @Test
    void anonymousRequestToAdminProductsIsUnauthorized() {
        assertUnauthorizedForAnonymous("/api/admin/products");
    }

    @Test
    void anonymousRequestToAdminOrdersIsUnauthorized() {
        assertUnauthorizedForAnonymous("/api/admin/orders");
    }

    private void assertForbiddenForNonAdmin(String path) {
        String token = registerAndGetToken();

        ResponseEntity<ApiError> response = restTemplate.exchange(
                path, HttpMethod.GET, new HttpEntity<>(authHeaders(token)), ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    private void assertUnauthorizedForAnonymous(String path) {
        ResponseEntity<ApiError> response = restTemplate.getForEntity(path, ApiError.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
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
        return "admin-access-" + UUID.randomUUID() + "@example.com";
    }
}
