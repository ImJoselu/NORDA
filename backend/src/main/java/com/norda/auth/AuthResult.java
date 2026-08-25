package com.norda.auth;

import com.norda.user.User;

import java.time.Instant;

/**
 * Transporte interno servicio -> controller. El controller decide como exponer
 * esto por HTTP (JSON body + cookie httpOnly); el servicio no conoce Servlet API.
 */
public record AuthResult(
        User user,
        String accessToken,
        String refreshToken,
        Instant refreshTokenExpiresAt
) {
}
