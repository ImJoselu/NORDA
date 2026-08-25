package com.norda.origin;

import com.norda.country.Continent;
import com.norda.country.Country;
import com.norda.country.CountryRepository;
import com.norda.origin.dto.ContinentGroup;
import com.norda.origin.dto.CountryDetailResponse;
import com.norda.origin.dto.CountryRef;
import com.norda.origin.dto.CountrySummary;
import com.norda.origin.dto.FarmSummary;
import com.norda.origin.dto.OriginStats;
import com.norda.origin.dto.ProducerSummary;
import com.norda.origin.dto.RegionDetailResponse;
import com.norda.origin.dto.RegionSummary;
import com.norda.producer.Farm;
import com.norda.producer.FarmRepository;
import com.norda.producer.Producer;
import com.norda.producer.ProducerRepository;
import com.norda.product.Process;
import com.norda.product.Product;
import com.norda.product.ProductMapper;
import com.norda.product.ProductRepository;
import com.norda.product.ProductStatus;
import com.norda.product.dto.ProductSummaryResponse;
import com.norda.region.Region;
import com.norda.region.RegionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class OriginService {

    private final CountryRepository countryRepository;
    private final RegionRepository regionRepository;
    private final ProducerRepository producerRepository;
    private final FarmRepository farmRepository;
    private final ProductRepository productRepository;

    public OriginService(
            CountryRepository countryRepository,
            RegionRepository regionRepository,
            ProducerRepository producerRepository,
            FarmRepository farmRepository,
            ProductRepository productRepository
    ) {
        this.countryRepository = countryRepository;
        this.regionRepository = regionRepository;
        this.producerRepository = producerRepository;
        this.farmRepository = farmRepository;
        this.productRepository = productRepository;
    }

    public List<ContinentGroup> tree() {
        List<Country> countries = countryRepository.findAllByOrderByNameAsc();
        Map<Continent, List<Country>> byContinent = countries.stream()
                .collect(Collectors.groupingBy(Country::getContinent, LinkedHashMap::new, Collectors.toList()));

        return Arrays.stream(Continent.values())
                .filter(byContinent::containsKey)
                .map(continent -> new ContinentGroup(
                        continent.name(),
                        byContinent.get(continent).stream()
                                .map(country -> new CountrySummary(
                                        country.getName(),
                                        country.getSlug(),
                                        country.getLatitude(),
                                        country.getLongitude(),
                                        productRepository.findByCountryIdAndStatus(country.getId(), ProductStatus.ACTIVE).size()
                                ))
                                .toList()
                ))
                .toList();
    }

    public CountryDetailResponse countryDetail(String slug) {
        Country country = countryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pais no encontrado."));

        List<Region> regions = regionRepository.findAllByCountryIdOrderByNameAsc(country.getId());
        List<Product> products = productRepository.findByCountryIdAndStatus(country.getId(), ProductStatus.ACTIVE);

        List<RegionSummary> regionSummaries = regions.stream()
                .map(region -> {
                    long productCount = products.stream().filter(p -> p.getRegion().getId().equals(region.getId())).count();
                    int producerCount = producerRepository.findAllByRegionIdOrderByNameAsc(region.getId()).size();
                    return new RegionSummary(region.getName(), region.getSlug(), region.getLatitude(), region.getLongitude(),
                            producerCount, (int) productCount);
                })
                .toList();

        List<ProductSummaryResponse> relatedProducts = products.stream().map(ProductMapper::toSummary).toList();

        return new CountryDetailResponse(
                country.getName(), country.getSlug(), country.getContinent().name(), country.getDescription(),
                country.getLatitude(), country.getLongitude(),
                computeStats(country, products), regionSummaries, relatedProducts
        );
    }

    public RegionDetailResponse regionDetail(String countrySlug, String regionSlug) {
        Region region = regionRepository.findBySlug(regionSlug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Region no encontrada."));

        if (!region.getCountry().getSlug().equals(countrySlug)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Region no encontrada.");
        }

        List<Producer> producers = producerRepository.findAllByRegionIdOrderByNameAsc(region.getId());
        List<Product> products = productRepository.findByRegionIdAndStatus(region.getId(), ProductStatus.ACTIVE);

        List<ProducerSummary> producerSummaries = producers.stream()
                .map(producer -> {
                    List<Farm> farms = farmRepository.findAllByProducerIdOrderByNameAsc(producer.getId());
                    List<FarmSummary> farmSummaries = farms.stream()
                            .map(farm -> new FarmSummary(farm.getName(), farm.getSlug(), farm.getAltitudeM()))
                            .toList();
                    return new ProducerSummary(producer.getName(), producer.getSlug(), producer.getDescription(), farmSummaries);
                })
                .toList();

        return new RegionDetailResponse(
                region.getName(), region.getSlug(), region.getDescription(), region.getLatitude(), region.getLongitude(),
                new CountryRef(region.getCountry().getName(), region.getCountry().getSlug()),
                producerSummaries,
                products.stream().map(ProductMapper::toSummary).toList()
        );
    }

    private OriginStats computeStats(Country country, List<Product> products) {
        if (products.isEmpty()) {
            return new OriginStats(country.getTypicalAltitudeMinM(), country.getTypicalAltitudeMaxM(), List.of(), 0, 0, 0, List.of());
        }

        int altitudeMin = products.stream().mapToInt(Product::getAltitudeM).min().orElse(country.getTypicalAltitudeMinM());
        int altitudeMax = products.stream().mapToInt(Product::getAltitudeM).max().orElse(country.getTypicalAltitudeMaxM());

        List<String> commonProcesses = products.stream()
                .collect(Collectors.groupingBy(Product::getProcess, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<Process, Long>comparingByValue().reversed())
                .map(entry -> entry.getKey().name())
                .toList();

        double avgAcidity = products.stream().mapToInt(Product::getAcidity).average().orElse(0);
        double avgBody = products.stream().mapToInt(Product::getBody).average().orElse(0);
        double avgSweetness = products.stream().mapToInt(Product::getSweetness).average().orElse(0);

        List<String> topRegions = products.stream()
                .collect(Collectors.groupingBy(p -> p.getRegion().getName(), Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .toList();

        return new OriginStats(altitudeMin, altitudeMax, commonProcesses, round1(avgAcidity), round1(avgBody), round1(avgSweetness), topRegions);
    }

    private double round1(double value) {
        return Math.round(value * 10) / 10.0;
    }
}
