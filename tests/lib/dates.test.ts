import { describe, it, expect } from 'vitest'
import { toLocalISO, todayISO, yesterdayISO, fmtDate, isoInMonth, monthLabel } from '@/lib/dates'

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

describe('isoInMonth', () => {
  it('matches a date inside the given month', () => {
    expect(isoInMonth('2026-06-12', 2026, 6)).toBe(true)
  })
  it('rejects a date in a different month', () => {
    expect(isoInMonth('2026-05-31', 2026, 6)).toBe(false)
  })
  it('rejects the same month in a different year', () => {
    expect(isoInMonth('2025-06-12', 2026, 6)).toBe(false)
  })
  it('pads single-digit months when comparing', () => {
    expect(isoInMonth('2026-01-05', 2026, 1)).toBe(true)
  })
})

describe('monthLabel', () => {
  it('returns Thai month name with Buddhist-era year', () => {
    expect(monthLabel(2026, 6, 'th')).toBe('มิถุนายน 2569')
  })
  it('returns English month name with Gregorian year', () => {
    expect(monthLabel(2026, 6, 'en')).toBe('June 2026')
  })
  it('handles year rollover at January', () => {
    expect(monthLabel(2026, 1, 'en')).toBe('January 2026')
    expect(monthLabel(2026, 12, 'en')).toBe('December 2026')
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
