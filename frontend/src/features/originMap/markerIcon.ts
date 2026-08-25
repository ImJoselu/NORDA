import L from 'leaflet'

/**
 * Icono propio en lugar de los PNG por defecto de Leaflet: evitamos el problema
 * clasico de rutas rotas de marker-icon.png con bundlers como Vite.
 */
export function createDotIcon(size: number, color = '#A9633D') {
  return L.divIcon({
    className: 'norda-map-dot',
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid #F7F2EA;box-shadow:0 1px 4px rgba(23,19,15,0.35)"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}
