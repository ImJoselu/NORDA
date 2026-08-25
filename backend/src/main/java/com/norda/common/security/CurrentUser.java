package com.norda.common.security;

import org.springframework.security.core.Authentication;

import java.util.UUID;

/**
 * El principal de autenticacion es el UUID del usuario (ver JwtAuthenticationFilter):
 * no se vuelve a consultar la base de datos en cada request para construir un
 * UserDetails completo, ya que el JWT es autocontenido.
 */
public final class CurrentUser {

    private CurrentUser() {
    }

    public static UUID id(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }
}
