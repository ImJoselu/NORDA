package com.norda.common.web;

import java.time.Instant;

/**
 * Formato de error unico para toda la API (ver docs/api.md).
 */
public record ApiError(
        Instant timestamp,
        int status,
        String code,
        String message,
        String path
) {

    public static ApiError of(int status, String code, String message, String path) {
        return new ApiError(Instant.now(), status, code, message, path);
    }
}
