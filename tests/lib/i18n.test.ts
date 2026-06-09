import { describe, it, expect } from 'vitest'
import { t } from '@/lib/i18n'

describe('t()', () => {
  it('returns Thai string for known key', () => {
    expect(t('income', 'th')).toBe('รายรับ')
    expect(t('expense', 'th')).toBe('รายจ่าย')
  })
  it('returns English string for known key', () => {
    expect(t('income', 'en')).toBe('Income')
    expect(t('expense', 'en')).toBe('Expense')
  })
  it('substitutes {n} variable', () => {
    expect(t('avgPerDay', 'th', { n: 500 })).toBe('เฉลี่ย 500 บาท/วัน')
    expect(t('avgPerDay', 'en', { n: 250 })).toBe('Avg 250 THB/day')
    expect(t('expected', 'th', { n: 33 })).toBe('คาดการณ์ 33%')
  })
  it('returns key for unknown keys', () => {
    expect(t('unknown_key_xyz', 'th')).toBe('unknown_key_xyz')
  })
})
