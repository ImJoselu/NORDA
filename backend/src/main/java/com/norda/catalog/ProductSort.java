package com.norda.catalog;

import org.springframework.data.domain.Sort;

/**
 * "Mas vendidos", "Mas populares" y "Valoracion" (seccion 17) se anadiran cuando
 * existan pedidos y reviews reales que alimenten esas senales; hasta entonces no
 * se exponen como opciones (no simular datos que aun no existen).
 */
public enum ProductSort {
    RECOMMENDED,
    NEWEST,
    PRICE_ASC,
    PRICE_DESC;

    public Sort toSort() {
        return switch (this) {
            case PRICE_ASC -> Sort.by(Sort.Direction.ASC, "basePriceCents");
            case PRICE_DESC -> Sort.by(Sort.Direction.DESC, "basePriceCents");
            case NEWEST, RECOMMENDED -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
