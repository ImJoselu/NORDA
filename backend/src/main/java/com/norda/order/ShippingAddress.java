package com.norda.order;

import jakarta.validation.constraints.NotBlank;

public record ShippingAddress(
        @NotBlank String fullName,
        @NotBlank String line1,
        String line2,
        @NotBlank String city,
        @NotBlank String region,
        @NotBlank String postalCode,
        @NotBlank String country,
        @NotBlank String phone
) {
}
