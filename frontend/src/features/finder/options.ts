import { METHOD_LABELS } from '@/utils/coffeeLabels'
import type { AcidityPreference, BodyPreference, BudgetRange, FlavorProfile } from '@/types/finder'

export const METHOD_OPTIONS = Object.entries(METHOD_LABELS).map(([value, label]) => ({ value, label }))

export const PROFILE_OPTIONS: { value: FlavorProfile; label: string }[] = [
  { value: 'SWEET', label: 'Dulce' },
  { value: 'FRUITY', label: 'Frutal' },
  { value: 'CHOCOLATE', label: 'Chocolate' },
  { value: 'FLORAL', label: 'Floral' },
  { value: 'CITRUS', label: 'Cítrico' },
  { value: 'INTENSE', label: 'Intenso' },
]

export const BODY_OPTIONS: { value: BodyPreference; label: string }[] = [
  { value: 'LIGHT', label: 'Ligero' },
  { value: 'MEDIUM', label: 'Medio' },
  { value: 'INTENSE', label: 'Intenso' },
]

export const ACIDITY_OPTIONS: { value: AcidityPreference; label: string }[] = [
  { value: 'LOW', label: 'Baja' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'HIGH', label: 'Alta' },
]

export const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: 'UNDER_15', label: 'Menos de 15 €' },
  { value: 'FROM_15_TO_20', label: '15 € – 20 €' },
  { value: 'FROM_20_TO_30', label: '20 € – 30 €' },
  { value: 'OVER_30', label: 'Más de 30 €' },
]
