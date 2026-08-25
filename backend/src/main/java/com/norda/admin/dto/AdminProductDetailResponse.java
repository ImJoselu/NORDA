package com.norda.admin.dto;

import com.norda.product.BrewMethod;
import com.norda.product.Process;
import com.norda.product.Product;
import com.norda.product.ProductStatus;
import com.norda.product.RoastLevel;

import java.util.List;
import java.util.Set;
import java.util.UUID;

/** Espejo editable de Product, usado para precargar el formulario de edicion del admin. */
public record AdminProductDetailResponse(
        UUID id,
        String sku,
        String slug,
        String name,
        String shortDescription,
        String longDescription,
        UUID countryId,
        UUID regionId,
        UUID producerId,
        UUID farmId,
        String variety,
        Process process,
        int altitudeM,
        RoastLevel roastLevel,
        List<String> tastingNotes,
        int acidity,
        int body,
        int sweetness,
        Set<BrewMethod> recommendedMethods,
        ProductStatus status,
        long basePriceCents
) {
    public static AdminProductDetailResponse from(Product product) {
        return new AdminProductDetailResponse(
                product.getId(), product.getSku(), product.getSlug(), product.getName(),
                product.getShortDescription(), product.getLongDescription(),
                product.getCountry().getId(), product.getRegion().getId(), product.getProducer().getId(), product.getFarm().getId(),
                product.getVariety(), product.getProcess(), product.getAltitudeM(), product.getRoastLevel(),
                product.getTastingNotes(), product.getAcidity(), product.getBody(), product.getSweetness(),
                product.getRecommendedMethods(), product.getStatus(), product.getBasePriceCents()
        );
    }
}
