package com.norda.recommendation;

import com.norda.product.BrewMethod;
import com.norda.product.Product;
import com.norda.product.ProductMapper;
import com.norda.product.ProductRepository;
import com.norda.product.ProductStatus;
import com.norda.recommendation.dto.FinderRequest;
import com.norda.recommendation.dto.FinderResultItem;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Motor determinista basado en reglas (ADR-005). Pondera cinco factores
 * (seccion 16): metodo, perfil de sabor, cuerpo, acidez y presupuesto.
 * El presupuesto es un factor mas, no un filtro duro: con un catalogo de
 * tamano acotado, descartar cafes fuera de rango dejaria resultados vacios
 * con demasiada facilidad.
 */
@Service
@Transactional(readOnly = true)
public class RuleBasedRecommendationEngine implements RecommendationEngine {

    private static final double WEIGHT_METHOD = 0.30;
    private static final double WEIGHT_PROFILE = 0.25;
    private static final double WEIGHT_BODY = 0.20;
    private static final double WEIGHT_ACIDITY = 0.15;
    private static final double WEIGHT_BUDGET = 0.10;
    private static final double METHOD_PARTIAL_CREDIT = 0.35;
    private static final int MAX_RESULTS = 3;

    private static final Map<BrewMethod, String> METHOD_LABELS = new EnumMap<>(BrewMethod.class);
    private static final Map<FlavorProfile, String> PROFILE_LABELS = new EnumMap<>(FlavorProfile.class);

    static {
        METHOD_LABELS.put(BrewMethod.ESPRESSO, "espresso");
        METHOD_LABELS.put(BrewMethod.V60, "V60");
        METHOD_LABELS.put(BrewMethod.MOKA, "moka");
        METHOD_LABELS.put(BrewMethod.FRENCH_PRESS, "prensa francesa");
        METHOD_LABELS.put(BrewMethod.AEROPRESS, "aeropress");

        PROFILE_LABELS.put(FlavorProfile.SWEET, "dulce");
        PROFILE_LABELS.put(FlavorProfile.FRUITY, "frutal");
        PROFILE_LABELS.put(FlavorProfile.CHOCOLATE, "a chocolate");
        PROFILE_LABELS.put(FlavorProfile.FLORAL, "floral");
        PROFILE_LABELS.put(FlavorProfile.CITRUS, "cítrico");
        PROFILE_LABELS.put(FlavorProfile.INTENSE, "intenso");
    }

    private final ProductRepository productRepository;

    public RuleBasedRecommendationEngine(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<FinderResultItem> recommend(FinderRequest request) {
        List<ScoredProduct> scored = new ArrayList<>();

        for (Product product : productRepository.findAll()) {
            if (product.getStatus() != ProductStatus.ACTIVE) {
                continue;
            }
            scored.add(score(product, request));
        }

        return scored.stream()
                .sorted((a, b) -> Double.compare(b.total(), a.total()))
                .limit(MAX_RESULTS)
                .map(s -> new FinderResultItem(
                        ProductMapper.toSummary(s.product()),
                        (int) Math.round(s.total() * 100),
                        explain(s)
                ))
                .toList();
    }

    private ScoredProduct score(Product product, FinderRequest request) {
        boolean methodMatches = product.getRecommendedMethods().contains(request.method());
        double methodScore = methodMatches ? 1.0 : METHOD_PARTIAL_CREDIT;

        Set<FlavorProfile> productProfiles = FlavorKeywords.profilesFor(product.getTastingNotes());
        Set<FlavorProfile> matchedProfiles = new LinkedHashSet<>(productProfiles);
        matchedProfiles.retainAll(request.profiles());
        double profileScore = request.profiles().isEmpty()
                ? 1.0
                : matchedProfiles.size() / (double) request.profiles().size();

        double bodyScore = 1 - Math.min(1.0, Math.abs(product.getBody() - request.body().target()) / 4.0);
        double acidityScore = 1 - Math.min(1.0, Math.abs(product.getAcidity() - request.acidity().target()) / 4.0);
        double budgetScore = 1 - request.budget().distance(product.getBasePriceCents());

        double total = methodScore * WEIGHT_METHOD
                + profileScore * WEIGHT_PROFILE
                + bodyScore * WEIGHT_BODY
                + acidityScore * WEIGHT_ACIDITY
                + budgetScore * WEIGHT_BUDGET;

        return new ScoredProduct(product, total, methodMatches, request.method(), matchedProfiles, bodyScore, acidityScore);
    }

    private String explain(ScoredProduct s) {
        List<String> reasons = new ArrayList<>();

        if (s.methodMatches()) {
            reasons.add("se prepara especialmente bien en " + METHOD_LABELS.get(s.requestedMethod()));
        }
        if (!s.matchedProfiles().isEmpty()) {
            String profiles = s.matchedProfiles().stream().map(PROFILE_LABELS::get).reduce((a, b) -> a + " y " + b).orElse("");
            reasons.add("tiene un perfil " + profiles);
        }
        if (s.bodyScore() >= 0.75) {
            reasons.add("un cuerpo muy parecido al que buscas");
        }
        if (s.acidityScore() >= 0.75) {
            reasons.add("una acidez muy parecida a la que buscas");
        }

        if (reasons.isEmpty()) {
            reasons.add("es la opción más cercana a tus preferencias dentro de nuestro catálogo actual");
        }

        String reasonText = String.join(", además ", reasons);
        return "Te recomendamos " + s.product().getName() + " porque " + reasonText + ".";
    }

    private record ScoredProduct(
            Product product,
            double total,
            boolean methodMatches,
            BrewMethod requestedMethod,
            Set<FlavorProfile> matchedProfiles,
            double bodyScore,
            double acidityScore
    ) {
    }
}
