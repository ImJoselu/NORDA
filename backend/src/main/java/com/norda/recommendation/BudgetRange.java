package com.norda.recommendation;

public enum BudgetRange {
    UNDER_15(0, 1_500),
    FROM_15_TO_20(1_500, 2_000),
    FROM_20_TO_30(2_000, 3_000),
    OVER_30(3_000, Long.MAX_VALUE);

    private final long minCents;
    private final long maxCents;

    BudgetRange(long minCents, long maxCents) {
        this.minCents = minCents;
        this.maxCents = maxCents;
    }

    public long minCents() {
        return minCents;
    }

    public long maxCents() {
        return maxCents;
    }

    /** Distancia normalizada [0,1] del precio dado al rango: 0 si cae dentro. */
    public double distance(long priceCents) {
        if (priceCents >= minCents && priceCents <= maxCents) {
            return 0.0;
        }
        long diff = priceCents < minCents ? minCents - priceCents : priceCents - maxCents;
        return Math.min(1.0, diff / 1_500.0);
    }
}
