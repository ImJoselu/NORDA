package com.norda.admin;

import com.norda.admin.dto.AdminCountryRequest;
import com.norda.admin.dto.AdminCountryResponse;
import com.norda.admin.dto.AdminFarmResponse;
import com.norda.admin.dto.AdminProducerResponse;
import com.norda.admin.dto.AdminRegionRequest;
import com.norda.admin.dto.AdminRegionResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
public class AdminOriginController {

    private final AdminOriginService adminOriginService;

    public AdminOriginController(AdminOriginService adminOriginService) {
        this.adminOriginService = adminOriginService;
    }

    @GetMapping("/api/admin/countries")
    public List<AdminCountryResponse> listCountries() {
        return adminOriginService.listCountries();
    }

    @PostMapping("/api/admin/countries")
    public AdminCountryResponse createCountry(@Valid @RequestBody AdminCountryRequest request) {
        return adminOriginService.createCountry(request);
    }

    @PutMapping("/api/admin/countries/{id}")
    public AdminCountryResponse updateCountry(@PathVariable UUID id, @Valid @RequestBody AdminCountryRequest request) {
        return adminOriginService.updateCountry(id, request);
    }

    @GetMapping("/api/admin/regions")
    public List<AdminRegionResponse> listRegions(@RequestParam(required = false) UUID countryId) {
        return adminOriginService.listRegions(countryId);
    }

    @PostMapping("/api/admin/regions")
    public AdminRegionResponse createRegion(@Valid @RequestBody AdminRegionRequest request) {
        return adminOriginService.createRegion(request);
    }

    @PutMapping("/api/admin/regions/{id}")
    public AdminRegionResponse updateRegion(@PathVariable UUID id, @Valid @RequestBody AdminRegionRequest request) {
        return adminOriginService.updateRegion(id, request);
    }

    @GetMapping("/api/admin/producers")
    public List<AdminProducerResponse> listProducers(@RequestParam(required = false) UUID regionId) {
        return adminOriginService.listProducers(regionId);
    }

    @GetMapping("/api/admin/farms")
    public List<AdminFarmResponse> listFarms(@RequestParam(required = false) UUID producerId) {
        return adminOriginService.listFarms(producerId);
    }
}
