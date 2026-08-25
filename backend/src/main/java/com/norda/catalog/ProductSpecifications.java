package com.norda.catalog;

import com.norda.product.BrewMethod;
import com.norda.product.Process;
import com.norda.product.Product;
import com.norda.product.ProductStatus;
import com.norda.product.RoastLevel;
import org.springframework.data.jpa.domain.Specification;

/**
 * Cada metodo asume que el valor recibido no es null: quien construye el
 * Specification combinado (CatalogService) solo añade el predicado si el
 * filtro correspondiente viene informado.
 */
public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> hasStatus(ProductStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Product> countrySlugEquals(String slug) {
        return (root, query, cb) -> cb.equal(root.join("country").get("slug"), slug);
    }

    public static Specification<Product> regionSlugEquals(String slug) {
        return (root, query, cb) -> cb.equal(root.join("region").get("slug"), slug);
    }

    public static Specification<Product> producerSlugEquals(String slug) {
        return (root, query, cb) -> cb.equal(root.join("producer").get("slug"), slug);
    }

    public static Specification<Product> varietyEquals(String variety) {
        return (root, query, cb) -> cb.equal(cb.lower(root.get("variety")), variety.toLowerCase());
    }

    public static Specification<Product> processEquals(Process process) {
        return (root, query, cb) -> cb.equal(root.get("process"), process);
    }

    public static Specification<Product> roastLevelEquals(RoastLevel roastLevel) {
        return (root, query, cb) -> cb.equal(root.get("roastLevel"), roastLevel);
    }

    public static Specification<Product> methodEquals(BrewMethod method) {
        return (root, query, cb) -> {
            query.distinct(true);
            return cb.equal(root.join("recommendedMethods"), method);
        };
    }

    public static Specification<Product> altitudeAtLeast(int min) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("altitudeM"), min);
    }

    public static Specification<Product> altitudeAtMost(int max) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("altitudeM"), max);
    }

    public static Specification<Product> acidityAtLeast(int min) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("acidity"), min);
    }

    public static Specification<Product> acidityAtMost(int max) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("acidity"), max);
    }

    public static Specification<Product> bodyAtLeast(int min) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("body"), min);
    }

    public static Specification<Product> bodyAtMost(int max) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("body"), max);
    }

    public static Specification<Product> priceAtLeast(long minCents) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("basePriceCents"), minCents);
    }

    public static Specification<Product> priceAtMost(long maxCents) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("basePriceCents"), maxCents);
    }

    public static Specification<Product> searchText(String q) {
        return (root, query, cb) -> {
            String like = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(root.get("variety")), like)
            );
        };
    }
}
