package com.norda.user.dto;

import java.util.Set;
import java.util.UUID;

public record UserSummaryResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        Set<String> roles
) {
}
