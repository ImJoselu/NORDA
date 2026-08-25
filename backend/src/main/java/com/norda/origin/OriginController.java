package com.norda.origin;

import com.norda.origin.dto.ContinentGroup;
import com.norda.origin.dto.CountryDetailResponse;
import com.norda.origin.dto.RegionDetailResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/origins")
public class OriginController {

    private final OriginService originService;

    public OriginController(OriginService originService) {
        this.originService = originService;
    }

    @GetMapping
    public List<ContinentGroup> tree() {
        return originService.tree();
    }

    @GetMapping("/{country}")
    public CountryDetailResponse country(@PathVariable String country) {
        return originService.countryDetail(country);
    }

    @GetMapping("/{country}/{region}")
    public RegionDetailResponse region(@PathVariable String country, @PathVariable String region) {
        return originService.regionDetail(country, region);
    }
}
