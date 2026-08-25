package com.norda.auth.dto;

import com.norda.user.dto.UserSummaryResponse;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        UserSummaryResponse user
) {
    public static AuthResponse bearer(String accessToken, long expiresIn, UserSummaryResponse user) {
        return new AuthResponse(accessToken, "Bearer", expiresIn, user);
    }
}
