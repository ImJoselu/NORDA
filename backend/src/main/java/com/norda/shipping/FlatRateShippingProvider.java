package com.norda.shipping;

import org.springframework.stereotype.Service;

@Service
public class FlatRateShippingProvider implements ShippingProvider {

    private static final long STANDARD_CENTS = 350;
    private static final long EXPRESS_CENTS = 890;
    private static final long FREE_STANDARD_THRESHOLD_CENTS = 3500;

    @Override
    public long costCents(ShippingMethod method, long subtotalCents) {
        return switch (method) {
            case PICKUP -> 0;
            case EXPRESS -> EXPRESS_CENTS;
            case STANDARD -> subtotalCents >= FREE_STANDARD_THRESHOLD_CENTS ? 0 : STANDARD_CENTS;
        };
    }
}
