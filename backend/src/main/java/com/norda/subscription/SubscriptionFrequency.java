package com.norda.subscription;

import java.time.LocalDate;

public enum SubscriptionFrequency {
    TWO_WEEKS {
        @Override
        public LocalDate nextDate(LocalDate from) {
            return from.plusWeeks(2);
        }
    },
    ONE_MONTH {
        @Override
        public LocalDate nextDate(LocalDate from) {
            return from.plusMonths(1);
        }
    },
    SIX_WEEKS {
        @Override
        public LocalDate nextDate(LocalDate from) {
            return from.plusWeeks(6);
        }
    },
    TWO_MONTHS {
        @Override
        public LocalDate nextDate(LocalDate from) {
            return from.plusMonths(2);
        }
    };

    public abstract LocalDate nextDate(LocalDate from);
}
