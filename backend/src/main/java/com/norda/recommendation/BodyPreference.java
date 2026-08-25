package com.norda.recommendation;

public enum BodyPreference {
    LIGHT(2.0),
    MEDIUM(3.0),
    INTENSE(4.5);

    private final double target;

    BodyPreference(double target) {
        this.target = target;
    }

    public double target() {
        return target;
    }
}
