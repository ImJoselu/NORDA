package com.norda.recommendation;

public enum AcidityPreference {
    LOW(2.0),
    MEDIUM(3.0),
    HIGH(4.5);

    private final double target;

    AcidityPreference(double target) {
        this.target = target;
    }

    public double target() {
        return target;
    }
}
