import type { Lang } from './types'

export const MONTH_TH = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
]
export const MONTH_EN = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export function monthLabel(year: number, month: number, lang: Lang): string {
  return lang === 'th'
    ? `${MONTH_TH[month - 1]} ${year + 543}`
    : `${MONTH_EN[month - 1]} ${year}`
}

/** Format a Date as YYYY-MM-DD in the user's local timezone (not UTC). */
export function toLocalISO(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayISO(): string {
  return toLocalISO(new Date())
}

export function yesterdayISO(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return toLocalISO(d)
}

/** True when a YYYY-MM-DD string falls inside the given year/month (1-based). */
export function isoInMonth(iso: string, year: number, month: number): boolean {
  return iso.startsWith(`${year}-${String(month).padStart(2, '0')}-`)
}

/** Display a YYYY-MM-DD string as a readable date, e.g. "11 มิ.ย. 2569" / "11 Jun 2026". */
export function fmtDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
