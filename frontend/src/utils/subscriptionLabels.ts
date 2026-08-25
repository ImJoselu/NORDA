import type { SubscriptionFrequency, SubscriptionStatus, SubscriptionType } from '@/types/subscription'

export const FREQUENCY_LABELS: Record<SubscriptionFrequency, string> = {
  TWO_WEEKS: 'Cada 2 semanas',
  ONE_MONTH: 'Cada mes',
  SIX_WEEKS: 'Cada 6 semanas',
  TWO_MONTHS: 'Cada 2 meses',
}

export const TYPE_LABELS: Record<SubscriptionType, string> = {
  FIXED: 'Café fijo',
  SURPRISE: 'Café sorpresa',
  ORIGIN_DISCOVERY: 'Descubrimiento por origen',
}

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: 'Activa',
  PAUSED: 'Pausada',
  CANCELLED: 'Cancelada',
}

export const SUBSCRIPTION_STATUS_TONE: Record<SubscriptionStatus, 'success' | 'warning' | 'danger'> = {
  ACTIVE: 'success',
  PAUSED: 'warning',
  CANCELLED: 'danger',
}
