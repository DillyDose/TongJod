import { describe, it, expect } from 'vitest'
import { computeStatus, THEMES } from '@/lib/theme'

describe('computeStatus', () => {
  it('returns default when no budget set', () => {
    expect(computeStatus(50, 50, false)).toBe('default')
  })
  it('returns excellent when 10%+ below expected', () => {
    expect(computeStatus(20, 40, true)).toBe('excellent') // diff = -20
    expect(computeStatus(30, 41, true)).toBe('excellent') // diff = -11
  })
  it('returns onTrack when within ±10% of expected', () => {
    expect(computeStatus(35, 40, true)).toBe('onTrack')  // diff = -5
    expect(computeStatus(40, 40, true)).toBe('onTrack')  // diff = 0
    expect(computeStatus(48, 40, true)).toBe('onTrack')  // diff = +8
    expect(computeStatus(50, 40, true)).toBe('onTrack')  // diff = +10 (edge)
  })
  it('returns over when more than 10% above expected', () => {
    expect(computeStatus(51, 40, true)).toBe('over') // diff = +11
    expect(computeStatus(70, 40, true)).toBe('over') // diff = +30
  })
})

describe('THEMES', () => {
  it('has all four status keys', () => {
    expect(Object.keys(THEMES)).toEqual(['excellent', 'onTrack', 'over', 'default'])
  })
  it('each theme has required fields', () => {
    for (const theme of Object.values(THEMES)) {
      expect(theme).toHaveProperty('gradient')
      expect(theme).toHaveProperty('accent')
      expect(theme).toHaveProperty('accentLight')
      expect(theme).toHaveProperty('bar')
    }
  })
})
