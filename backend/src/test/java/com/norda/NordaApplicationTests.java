package com.norda;

import org.junit.jupiter.api.Test;

class NordaApplicationTests extends AbstractIntegrationTest {

    @Test
    void contextLoads() {
        // Verifica que el contexto de Spring arranca correctamente contra un
        // PostgreSQL real (Testcontainers) con las migraciones de Flyway aplicadas.
    }
}
