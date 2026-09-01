import { PhotoOrArt } from './PhotoOrArt'
import type { RoastLevel } from '@/types/catalog'

// Varias fotos por nivel de tueste: con un unico archivo por nivel, un catalogo con muchos
// productos del mismo tueste (la mayoria son LIGHT) repite la misma imagen una y otra vez y
// se nota como falso. Repartir entre varias reduce esa repeticion.
const ROAST_IMAGES: Record<RoastLevel, string[]> = {
  LIGHT: [
    '/images/coffees/roast-light.jpg',
    '/images/coffees/roast-light-2.jpg',
    '/images/coffees/roast-light-3.jpg',
    '/images/coffees/roast-light-4.jpg',
    '/images/coffees/roast-light-5.jpg',
    '/images/coffees/roast-light-6.jpg',
  ],
  MEDIUM: [
    '/images/coffees/roast-medium.jpg',
    '/images/coffees/roast-medium-2.jpg',
    '/images/coffees/roast-medium-3.jpg',
    '/images/coffees/roast-medium-4.jpg',
    '/images/coffees/roast-medium-5.jpg',
  ],
  MEDIUM_DARK: [
    '/images/coffees/roast-medium-dark.jpg',
    '/images/coffees/roast-medium-dark-2.jpg',
    '/images/coffees/roast-medium-dark-3.jpg',
    '/images/coffees/roast-medium-dark-4.jpg',
  ],
  DARK: ['/images/coffees/roast-dark.jpg'],
}

// Fotos reales de un producto concreto (no de banco de imagenes) subidas para ese cafe
// especifico. Tienen prioridad absoluta sobre el pool generico por nivel de tueste.
const PRODUCT_PHOTOS: Record<string, string> = {
  'colombia-narino-finca-el-mirador': '/images/coffees/products/colombia-narino-finca-el-mirador.webp',
}

// Indice explicito por producto (slug -> posicion en ROAST_IMAGES[roastLevel]), calculado a
// partir de los 28 productos de backend/.../V4__seed_data.sql. Dentro de cada pais el indice
// es siempre correlativo (offset del pais + posicion del cafe dentro de ese pais, modulo el
// tamano del pool), asi que dos cafes del mismo pais o region NUNCA comparten foto, sea cual
// sea el tamano del pool. Un indice global por orden alfabetico de slug (sin agrupar por pais)
// no garantiza esto: dos productos separados exactamente por el tamano del pool caen en el
// mismo indice aunque sean del mismo pais (le paso a Etiopia Guji / Kenia Nyeri Gikanda con un
// pool de 6). Un slug ausente de este mapa (dato de semilla nuevo) cae al hash determinista de
// respaldo, que sigue siendo estable pero ya no garantiza ausencia de repeticion.
const PRODUCT_IMAGE_INDEX: Record<string, number> = {
  // LIGHT (pool de 6)
  'colombia-cauca-finca-buenos-aires': 0,
  'colombia-huila-finca-la-esperanza': 1,
  // colombia-narino-finca-el-mirador tiene foto real propia, ver PRODUCT_PHOTOS
  'costa-rica-tarrazu-finca-la-candelilla': 1,
  'costa-rica-tarrazu-microbeneficio-don-mayo': 2,
  'etiopia-guji-finca-uraga': 2,
  'etiopia-sidama-cooperativa-bensa': 3,
  'etiopia-yirgacheffe-estacion-konga': 4,
  'guatemala-huehuetenango-finca-la-soledad': 3,
  'kenia-kirinyaga-cooperativa-kiangoi': 4,
  'kenia-nyeri-cooperativa-tekangu': 5,
  'kenia-nyeri-estacion-gikanda': 0,
  'panama-boquete-finca-alto-boquete': 5,
  'panama-boquete-finca-el-roble': 0,
  'peru-cajamarca-cooperativa-sol-naciente': 0,
  'ruanda-huye-cooperativa-maraba': 1,
  'ruanda-nyamasheke-estacion-kagano': 2,
  // MEDIUM (pool de 5)
  'brasil-sul-de-minas-fazenda-boa-vista': 0,
  'brasil-sul-de-minas-fazenda-santa-ines': 1,
  'costa-rica-tres-rios-finca-las-lajas': 1,
  'guatemala-antigua-finca-los-volcanes': 2,
  'guatemala-antigua-finca-san-jose': 3,
  'indonesia-gayo-estacion-takengon': 3,
  'panama-volcan-finca-santa-teresa': 4,
  'peru-cusco-cooperativa-valle-de-quillabamba': 0,
  // MEDIUM_DARK (pool de 4)
  'brasil-cerrado-mineiro-fazenda-cachoeira': 0,
  'indonesia-gayo-koperasi-gayo-mandiri': 1,
  'indonesia-toraja-koperasi-toraja-melo': 2,
}

function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash
}

interface CoffeePhotoProps {
  roastLevel: RoastLevel
  seed: string
  alt: string
  className?: string
}

/**
 * Foto real del producto si existe (PRODUCT_PHOTOS); si no, una fotografia generica de
 * grano tostado (ver public/images/CREDITS.md) elegida segun el nivel de tueste, con
 * fallback a OriginArt via PhotoOrArt.
 */
export function CoffeePhoto({ roastLevel, seed, alt, className = '' }: CoffeePhotoProps) {
  const images = ROAST_IMAGES[roastLevel]
  const index = PRODUCT_IMAGE_INDEX[seed] ?? hashSeed(seed) % images.length
  const src = PRODUCT_PHOTOS[seed] ?? images[index % images.length]
  return <PhotoOrArt src={src} seed={seed} alt={alt} className={className} />
}
