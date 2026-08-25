import type { BrewMethod, CoffeeProcess, RoastLevel } from '@/types/catalog'

export const PROCESS_LABELS: Record<CoffeeProcess, string> = {
  WASHED: 'Lavado',
  NATURAL: 'Natural',
  HONEY: 'Honey',
  ANAEROBIC: 'Anaeróbico',
}

export const ROAST_LABELS: Record<RoastLevel, string> = {
  LIGHT: 'Tueste claro',
  MEDIUM: 'Tueste medio',
  MEDIUM_DARK: 'Tueste medio-oscuro',
  DARK: 'Tueste oscuro',
}

export const METHOD_LABELS: Record<BrewMethod, string> = {
  ESPRESSO: 'Espresso',
  V60: 'V60',
  MOKA: 'Moka',
  FRENCH_PRESS: 'French Press',
  AEROPRESS: 'Aeropress',
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}
