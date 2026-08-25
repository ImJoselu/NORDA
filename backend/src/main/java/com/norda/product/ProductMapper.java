package com.norda.product;

import com.norda.inventory.Inventory;
import com.norda.product.dto.LotSummary;
import com.norda.product.dto.OriginSummary;
import com.norda.product.dto.ProductDetailResponse;
import com.norda.product.dto.ProductSummaryResponse;
import com.norda.product.dto.ProductVariantResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class ProductMapper {

    private ProductMapper() {
    }

    public static ProductSummaryResponse toSummary(Product product) {
        return new ProductSummaryResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getSlug(),
                product.getShortDescription(),
                product.getCountry().getName(),
                product.getCountry().getSlug(),
                product.getRegion().getName(),
                product.getRegion().getSlug(),
                product.getRoastLevel(),
                product.getProcess(),
                product.getTastingNotes(),
                product.getAcidity(),
                product.getBody(),
                product.getSweetness(),
                product.getBasePriceCents(),
                product.getStatus()
        );
    }

    public static ProductDetailResponse toDetail(
            Product product,
            List<ProductVariant> variants,
            Map<UUID, Inventory> inventoryByVariantId
    ) {
        OriginSummary origin = new OriginSummary(
                product.getCountry().getName(),
                product.getCountry().getSlug(),
                product.getRegion().getName(),
                product.getRegion().getSlug(),
                product.getProducer().getName(),
                product.getProducer().getSlug(),
                product.getFarm().getName(),
                product.getFarm().getSlug()
        );

        LotSummary lot = product.getCurrentLot() == null ? null : new LotSummary(
                product.getCurrentLot().getCode(),
                product.getCurrentLot().getHarvestDate(),
                product.getCurrentLot().getRoastDate()
        );

        List<ProductVariantResponse> variantResponses = variants.stream()
                .map(variant -> {
                    Inventory inventory = inventoryByVariantId.get(variant.getId());
                    String availability = inventory == null ? "OUT_OF_STOCK" : inventory.getStatus().name();
                    return new ProductVariantResponse(
                            variant.getId(), variant.getWeightGrams(), variant.getGrind(),
                            variant.getPriceCents(), availability
                    );
                })
                .toList();

        return new ProductDetailResponse(
                product.getId(), product.getSku(), product.getName(), product.getSlug(),
                product.getShortDescription(), product.getLongDescription(),
                origin, product.getVariety(), product.getProcess(), product.getAltitudeM(), product.getRoastLevel(),
                product.getTastingNotes(), product.getAcidity(), product.getBody(), product.getSweetness(),
                product.getRecommendedMethods(), lot, variantResponses
        );
    }
}
