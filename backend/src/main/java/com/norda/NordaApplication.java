package com.norda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

/**
 * UserDetailsServiceAutoConfiguration excluida: la autenticacion es JWT propia
 * (ver auth.AuthService), no se usa UserDetailsService/AuthenticationManager en
 * ningun punto, asi que el usuario en memoria que Spring Boot generaria por
 * defecto no tiene ningun uso real y solo anadiria ruido a los logs.
 */
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class NordaApplication {

    public static void main(String[] args) {
        SpringApplication.run(NordaApplication.class, args);
    }
}
