package com.norda.recommendation;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Traduce las notas de cata en texto libre (espanol) a los perfiles de sabor
 * que ofrece el finder (seccion 15). Una misma nota puede pertenecer a varios
 * perfiles (p.ej. "naranja" es a la vez FRUITY y CITRUS).
 */
public final class FlavorKeywords {

    private static final Map<FlavorProfile, Set<String>> KEYWORDS = new EnumMap<>(FlavorProfile.class);

    static {
        KEYWORDS.put(FlavorProfile.SWEET, Set.of(
                "caramelo", "panela", "miel", "azucar morena", "melaza", "chocolate con leche", "cuerpo sedoso"
        ));
        KEYWORDS.put(FlavorProfile.FRUITY, Set.of(
                "manzana roja", "manzana", "naranja", "maracuya", "fresa", "arandano", "durazno", "uva",
                "mora", "cassis", "ciruela roja", "ciruela", "pina", "frutos rojos", "mandarina",
                "citrico", "citrico intenso", "citrico suave", "limon", "pomelo", "vino tinto", "vino"
        ));
        KEYWORDS.put(FlavorProfile.CHOCOLATE, Set.of(
                "cacao", "chocolate blanco", "chocolate", "chocolate negro", "chocolate con leche",
                "chocolate amargo", "cacahuete", "avellana", "nuez", "almendra"
        ));
        KEYWORDS.put(FlavorProfile.FLORAL, Set.of(
                "jazmin", "floral", "bergamota", "floral intenso", "te negro"
        ));
        KEYWORDS.put(FlavorProfile.CITRUS, Set.of(
                "citrico", "citrico intenso", "citrico suave", "limon", "pomelo", "naranja", "mandarina", "bergamota"
        ));
        KEYWORDS.put(FlavorProfile.INTENSE, Set.of(
                "tierra humeda", "tierra", "especias", "tabaco dulce", "hierbas", "cedro", "especias suaves",
                "chocolate negro", "chocolate amargo", "cuerpo untuoso", "humo suave"
        ));
    }

    private FlavorKeywords() {
    }

    public static Set<FlavorProfile> profilesFor(List<String> tastingNotes) {
        Set<FlavorProfile> result = EnumSet.noneOf(FlavorProfile.class);
        for (String note : tastingNotes) {
            String normalized = normalize(note);
            for (Map.Entry<FlavorProfile, Set<String>> entry : KEYWORDS.entrySet()) {
                if (entry.getValue().contains(normalized)) {
                    result.add(entry.getKey());
                }
            }
        }
        return result;
    }

    private static String normalize(String note) {
        return note.toLowerCase()
                .replace("á", "a").replace("é", "e").replace("í", "i")
                .replace("ó", "o").replace("ú", "u");
    }
}
