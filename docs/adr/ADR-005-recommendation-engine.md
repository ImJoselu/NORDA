# ADR-005: Motor de recomendación determinista por reglas (Coffee Finder)

## Estado
Aceptado

## Contexto
El Coffee Finder (sección 16) pide al usuario cinco señales —método de preparación, perfil de
sabor deseado, cuerpo, acidez y presupuesto— y debe devolver hasta 3 cafés del catálogo con una
explicación legible de por qué se recomienda cada uno. No existe historial de compra ni volumen
de datos suficiente (20-30 productos) para que un enfoque de aprendizaje automático o filtrado
colaborativo aporte algo que un sistema de reglas no pueda: con un catálogo de ese tamaño, un
modelo entrenado sería sobre-ingeniería sin datos reales que lo justifiquen, y el resultado sería
una caja negra difícil de explicar al usuario en la propia UI.

## Decisión
Se implementa `RecommendationEngine` como puerto de dominio, con `RuleBasedRecommendationEngine`
como única implementación: cada producto activo se puntúa con una media ponderada de 5 factores
(método 30%, perfil de sabor 25%, cuerpo 20%, acidez 15%, presupuesto 10%), se ordena de mayor a
menor puntuación y se explican en texto los factores que más pesaron en cada resultado
(`explain()` genera frases como "te recomendamos X porque se prepara especialmente bien en V60,
además tiene un perfil floral").

El presupuesto es un factor ponderado más, no un filtro que descarte productos fuera de rango:
con un catálogo acotado, un filtro duro dejaría con facilidad resultados vacíos para
combinaciones de preferencias poco comunes, lo que sería peor experiencia que mostrar la mejor
aproximación disponible.

## Por qué un puerto de dominio si solo hay una implementación
`RecommendationEngine` es una interfaz aunque hoy solo tenga un implementador, siguiendo el
mismo patrón puertos-y-adaptadores que `PaymentService` (ADR-004) y `ShippingProvider`: el día
que haya datos reales de compra e interacción, un motor basado en histórico de pedidos o en
similitud de productos comprados juntos podría implementar la misma interfaz sin tocar
`FinderController` ni el contrato JSON con el frontend. Es una costura deliberada para una
evolución conocida, no complejidad especulativa sin destino claro.

## Consecuencias
- El resultado es 100% determinista y explicable: la misma combinación de respuestas produce
  siempre la misma recomendación con el mismo razonamiento, lo cual es más útil para un
  portfolio (se puede razonar sobre el resultado) que un modelo probabilístico opaco.
- El motor conoce todo el catálogo en memoria en cada búsqueda (`productRepository.findAll()`
  filtrado por estado activo); a la escala actual (decenas de productos) el coste es
  insignificante, pero no escalaría sin cambios a un catálogo de miles de productos.
