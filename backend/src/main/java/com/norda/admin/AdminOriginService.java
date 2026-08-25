package com.norda.admin;

import com.norda.admin.dto.AdminCountryRequest;
import com.norda.admin.dto.AdminCountryResponse;
import com.norda.admin.dto.AdminFarmResponse;
import com.norda.admin.dto.AdminProducerResponse;
import com.norda.admin.dto.AdminRegionRequest;
import com.norda.admin.dto.AdminRegionResponse;
import com.norda.country.Country;
import com.norda.country.CountryRepository;
import com.norda.producer.FarmRepository;
import com.norda.producer.ProducerRepository;
import com.norda.region.Region;
import com.norda.region.RegionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

/**
 * CRUD de origenes (seccion 35). El alcance cubre Pais y Region (create/update);
 * Productor se expone solo en modo lectura desde aqui, ya que su gestion completa
 * (con Fincas y Lotes) no aporta valor adicional al portfolio frente al coste de
 * construir formularios anidados para datos ya sembrados de forma realista.
 */
@Service
@Transactional
public class AdminOriginService {

    private final CountryRepository countryRepository;
    private final RegionRepository regionRepository;
    private final ProducerRepository producerRepository;
    private final FarmRepository farmRepository;

    public AdminOriginService(CountryRepository countryRepository, RegionRepository regionRepository,
                               ProducerRepository producerRepository, FarmRepository farmRepository) {
        this.countryRepository = countryRepository;
        this.regionRepository = regionRepository;
        this.producerRepository = producerRepository;
        this.farmRepository = farmRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminCountryResponse> listCountries() {
        return countryRepository.findAllByOrderByNameAsc().stream().map(AdminCountryResponse::from).toList();
    }

    public AdminCountryResponse createCountry(AdminCountryRequest request) {
        if (request.slug() == null || request.slug().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El slug es obligatorio.");
        }
        if (request.continent() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El continente es obligatorio.");
        }
        if (countryRepository.findBySlug(request.slug()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un pais con ese slug.");
        }
        Country country = new Country(request.name(), request.slug(), request.continent(), request.description(),
                request.latitude(), request.longitude(), request.typicalAltitudeMinM(), request.typicalAltitudeMaxM());
        countryRepository.save(country);
        return AdminCountryResponse.from(country);
    }

    public AdminCountryResponse updateCountry(UUID id, AdminCountryRequest request) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pais no encontrado."));
        country.update(request.name(), request.description(), request.latitude(), request.longitude(),
                request.typicalAltitudeMinM(), request.typicalAltitudeMaxM());
        return AdminCountryResponse.from(country);
    }

    @Transactional(readOnly = true)
    public List<AdminRegionResponse> listRegions(UUID countryId) {
        List<Region> regions = countryId == null
                ? regionRepository.findAll()
                : regionRepository.findAllByCountryIdOrderByNameAsc(countryId);
        return regions.stream().map(AdminRegionResponse::from).toList();
    }

    public AdminRegionResponse createRegion(AdminRegionRequest request) {
        if (request.slug() == null || request.slug().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El slug es obligatorio.");
        }
        if (request.countryId() == null || request.countryId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El pais es obligatorio.");
        }
        if (regionRepository.findBySlug(request.slug()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una region con ese slug.");
        }
        Country country = countryRepository.findById(parseCountryId(request.countryId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pais no encontrado."));
        Region region = new Region(country, request.name(), request.slug(), request.description(),
                request.latitude(), request.longitude());
        regionRepository.save(region);
        return AdminRegionResponse.from(region);
    }

    public AdminRegionResponse updateRegion(UUID id, AdminRegionRequest request) {
        Region region = regionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Region no encontrada."));
        region.update(request.name(), request.description(), request.latitude(), request.longitude());
        return AdminRegionResponse.from(region);
    }

    @Transactional(readOnly = true)
    public List<AdminProducerResponse> listProducers(UUID regionId) {
        List<com.norda.producer.Producer> producers = regionId == null
                ? producerRepository.findAll()
                : producerRepository.findAllByRegionIdOrderByNameAsc(regionId);
        return producers.stream().map(AdminProducerResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<AdminFarmResponse> listFarms(UUID producerId) {
        List<com.norda.producer.Farm> farms = producerId == null
                ? farmRepository.findAll()
                : farmRepository.findAllByProducerIdOrderByNameAsc(producerId);
        return farms.stream().map(AdminFarmResponse::from).toList();
    }

    private UUID parseCountryId(String countryId) {
        try {
            return UUID.fromString(countryId);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El identificador del pais no es válido.");
        }
    }
}
