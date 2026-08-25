import { describe, expect, it } from 'vitest'
import { formatPrice, pluralize } from './coffeeLabels'

describe('formatPrice', () => {
  it('converts cents to euros with two decimal places and the euro sign', () => {
    // The exact separator characters (comma vs point, space vs nbsp) are delegated
    // to Intl and can vary with the ICU data available in the runtime, so we assert
    // on content, not on exact byte-for-byte formatting.
    expect(formatPrice(1250)).toMatch(/12,50\s*€/)
  })

  it('formats zero correctly', () => {
    expect(formatPrice(0)).toMatch(/0,00\s*€/)
  })

  it('rounds nothing away for prices that already have two significant decimals', () => {
    expect(formatPrice(123456)).toMatch(/234,56\s*€/)
  })
})

describe('pluralize', () => {
  it('uses the singular form for exactly one', () => {
    expect(pluralize(1, 'café', 'cafés')).toBe('1 café')
  })

  it('uses the plural form for zero', () => {
    expect(pluralize(0, 'café', 'cafés')).toBe('0 cafés')
  })

  it('uses the plural form for more than one', () => {
    expect(pluralize(5, 'café', 'cafés')).toBe('5 cafés')
  })
})
