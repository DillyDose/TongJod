import { describe, it, expect } from 'vitest'
import { toLocalISO, todayISO, yesterdayISO, fmtDate } from '@/lib/dates'

describe('toLocalISO', () => {
  it('formats using local calendar fields, not UTC', () => {
    // 00:30 local time — toISOString() would report the previous day
    // in any timezone ahead of UTC (e.g. Thailand UTC+7)
    const d = new Date(2026, 5, 11, 0, 30)
    expect(toLocalISO(d)).toBe('2026-06-11')
  })
  it('pads single-digit month and day', () => {
    expect(toLocalISO(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('todayISO / yesterdayISO', () => {
  it('yesterday is exactly one day before today', () => {
    const today = new Date(todayISO())
    const yesterday = new Date(yesterdayISO())
    expect(today.getTime() - yesterday.getTime()).toBe(24 * 60 * 60 * 1000)
  })
})

describe('fmtDate', () => {
  it('formats Thai with Buddhist-era year', () => {
    expect(fmtDate('2026-06-11', 'th')).toContain('2569')
  })
  it('formats English with short month', () => {
    expect(fmtDate('2026-06-11', 'en')).toBe('11 Jun 2026')
  })
  it('returns input unchanged when malformed', () => {
    expect(fmtDate('not-a-date', 'en')).toBe('not-a-date')
  })
})
