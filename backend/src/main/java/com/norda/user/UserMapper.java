package com.norda.user;

import com.norda.user.dto.UserSummaryResponse;

import java.util.stream.Collectors;

public final class UserMapper {

    private UserMapper() {
    }

    public static UserSummaryResponse toSummary(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
        );
    }
}
