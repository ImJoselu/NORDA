package com.norda.recommendation;

import com.norda.recommendation.dto.FinderRequest;
import com.norda.recommendation.dto.FinderResultItem;

import java.util.List;

/**
 * Puerto de dominio (ADR-005): implementacion actual determinista por reglas.
 * Una futura extension basada en historial/compras/IA implementaria esta misma
 * interfaz sin cambiar el controller ni el contrato con el frontend.
 */
public interface RecommendationEngine {

    List<FinderResultItem> recommend(FinderRequest request);
}
