# ADR-006: Leaflet + OpenStreetMap como proveedor de mapas

## Estado
Aceptado

## Contexto
El Origin Map (sección 6) necesita mostrar marcadores interactivos de países y regiones
cafeteras a dos escalas —mundial en `/origins` y Home, y de un país concreto en
`/origins/{country}`—, con popups que enlazan a la página de cada origen. Es una funcionalidad
central del producto (la premisa de NØRDA es "el café no empieza en tu taza, empieza en su
origen"), pero no necesita geocodificación en vivo, cálculo de rutas ni capas de datos
propietarias: solo pintar puntos sobre un mapa base y reaccionar a clics.

## Decisión
Se usa Leaflet + `react-leaflet` con teselas (tiles) del proyecto OpenStreetMap
(`{s}.tile.openstreetmap.org`), en vez de Google Maps o Mapbox.

Motivos concretos:
- **Sin clave de API**: sección 56 del brief prohíbe explícitamente hardcodear claves de API, y
  tanto Google Maps como Mapbox requieren una clave (y facturación asociada a partir de cierto
  volumen) incluso para el uso más básico. OpenStreetMap sirve teselas públicas sin
  autenticación, lo que elimina una variable de entorno más que gestionar y un coste que no
  aporta nada a un proyecto de portfolio sin usuarios reales de pago.
- **Bundle más ligero y sin dependencia de un SDK propietario**: Leaflet es una librería de
  ~40KB (min+gzip) con `react-leaflet` como binding oficial de React; Google Maps JS SDK y
  Mapbox GL JS son considerablemente más pesados y cargan su propio runtime de renderizado.
- **Marcadores propios en vez de los PNG por defecto de Leaflet**: `markerIcon.ts` genera un
  `L.divIcon` (un `<div>` con estilos, no una imagen) precisamente porque las rutas relativas de
  los iconos PNG por defecto de Leaflet se rompen de forma habitual con bundlers modernos como
  Vite —un problema conocido de la librería, no un error de configuración—, así que evitarlo de
  raíz con un icono propio es más robusto que parchear rutas de assets.

## Consecuencias
- El mapa no depende de ninguna cuenta de terceros ni clave de API: funciona igual en desarrollo
  y en producción sin configuración adicional.
- El uso de teselas públicas de OpenStreetMap está sujeto a su [política de uso
  aceptable](https://operations.osmfoundation.org/policies/tiles/), pensada para tráfico bajo o
  de desarrollo; una versión con tráfico de producción real y volumen alto debería migrar a un
  proveedor de teselas con capacidad garantizada (MapTiler, Stadia Maps, o Mapbox con clave
  propia) sin cambiar de librería cliente, ya que `react-leaflet` soporta cualquier proveedor de
  teselas compatible con el estándar XYZ cambiando solo la URL de `TileLayer`.
- Los componentes de mapa (`WorldOriginMap`, `CountryRegionMap`) se cargan de forma perezosa
  (`React.lazy`) en las páginas que los usan, para no penalizar el tiempo de carga inicial de
  rutas que no muestran mapa (ver `docs/architecture.md`, sección de rendimiento).
