package com.norda.recommendation.dto;

import com.norda.product.dto.ProductSummaryResponse;

public record FinderResultItem(
        ProductSummaryResponse product,
        int matchPercent,
        String explanation
) {
}
