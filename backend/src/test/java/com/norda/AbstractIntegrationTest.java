package com.norda;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Base para tests de integracion: levanta un PostgreSQL real via Testcontainers
 * (requiere Docker disponible en la maquina que ejecuta los tests; la aplicacion
 * en si NO depende de Docker para arrancar, solo esta suite de tests lo usa).
 *
 * Contenedor singleton compartido entre clases de test (patron recomendado por
 * Testcontainers): se arranca una vez y Ryuk lo limpia al terminar la JVM.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class AbstractIntegrationTest {

    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("norda_test")
            .withUsername("norda_test")
            .withPassword("norda_test");

    static {
        POSTGRES.start();
    }

    @DynamicPropertySource
    static void registerDatasource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }
}
