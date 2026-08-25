package com.norda.catalog;

import com.norda.common.web.PageResponse;
import com.norda.product.BrewMethod;
import com.norda.product.Process;
import com.norda.product.RoastLevel;
import com.norda.product.dto.ProductDetailResponse;
import com.norda.product.dto.ProductSummaryResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public PageResponse<ProductSummaryResponse> list(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String producer,
            @RequestParam(required = false) String variety,
            @RequestParam(required = false) Process process,
            @RequestParam(required = false) RoastLevel roast,
            @RequestParam(required = false) BrewMethod method,
            @RequestParam(required = false) Integer minAltitude,
            @RequestParam(required = false) Integer maxAltitude,
            @RequestParam(required = false) Integer minAcidity,
            @RequestParam(required = false) Integer maxAcidity,
            @RequestParam(required = false) Integer minBody,
            @RequestParam(required = false) Integer maxBody,
            @RequestParam(required = false) Long minPriceCents,
            @RequestParam(required = false) Long maxPriceCents,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "RECOMMENDED") ProductSort sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        ProductFilter filter = new ProductFilter(
                country, region, producer, variety, process, roast, method,
                minAltitude, maxAltitude, minAcidity, maxAcidity, minBody, maxBody,
                minPriceCents, maxPriceCents, q
        );
        return catalogService.search(filter, sort, page, size);
    }

    @GetMapping("/featured")
    public List<ProductSummaryResponse> featured() {
        return catalogService.featured();
    }

    @GetMapping("/{slug}")
    public ProductDetailResponse detail(@PathVariable String slug) {
        return catalogService.detail(slug);
    }
}
