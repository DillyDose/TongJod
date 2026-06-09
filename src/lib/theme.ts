import type { StatusKey, Theme } from './types'

export const THEMES: Record<StatusKey, Theme> = {
  excellent: {
    key: 'excellent',
    gradient: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 40%, #6EE7B7 100%)',
    accent: '#059669',
    accentLight: '#34D399',
    cardTint: 'rgba(16, 185, 129, 0.08)',
    bar: '#10B981',
    pillBg: '#D1FAE5',
    pillText: '#065F46',
    focusRing: 'rgba(5, 150, 105, 0.15)',
  },
  onTrack: {
    key: 'onTrack',
    gradient: 'linear-gradient(135deg, #FEF9C3 0%, #FDE68A 40%, #FCD34D 100%)',
    accent: '#D97706',
    accentLight: '#FBBF24',
    cardTint: 'rgba(245, 158, 11, 0.08)',
    bar: '#F59E0B',
    pillBg: '#FEF3C7',
    pillText: '#92400E',
    focusRing: 'rgba(217, 119, 6, 0.15)',
  },
  over: {
    key: 'over',
    gradient: 'linear-gradient(135deg, #FFE4E6 0%, #FECDD3 40%, #FDA4AF 100%)',
    accent: '#DC2626',
    accentLight: '#FB7185',
    cardTint: 'rgba(239, 68, 68, 0.08)',
    bar: '#EF4444',
    pillBg: '#FFE4E6',
    pillText: '#9F1239',
    focusRing: 'rgba(220, 38, 38, 0.15)',
  },
  default: {
    key: 'default',
    gradient: 'linear-gradient(135deg, #F7F5F1 0%, #EDE9E3 100%)',
    accent: '#78716C',
    accentLight: '#A8A29E',
    cardTint: 'rgba(120, 113, 108, 0.06)',
    bar: '#A8A29E',
    pillBg: '#F0EDE8',
    pillText: '#57534E',
    focusRing: 'rgba(120, 113, 108, 0.15)',
  },
}

/** Returns StatusKey based on actual vs expected spending percentages.
 *  diff = actualPct - expectedPct
 *  ≤ -10 → excellent, ≤ +10 → onTrack, > +10 → over
 */
export function computeStatus(
  actualPct: number,
  expectedPct: number,
  hasBudget: boolean,
): StatusKey {
  if (!hasBudget) return 'default'
  const diff = actualPct - expectedPct
  if (diff <= -10) return 'excellent'
  if (diff <= 10) return 'onTrack'
  return 'over'
}

export const STATUS_MESSAGES: Record<StatusKey, string[]> = {
  excellent: [
    'เก่งมาก ประหยัดได้เยอะสุดๆ',
    'ยอดเยี่ยม! ประหยัดกว่าแผนมาก',
    'สุดยอด! เงินเหลือเยอะเลย',
  ],
  onTrack: [
    'ทำได้ตามแผนเลย ดีมาก!',
    'ยังอยู่ในงบ สู้ต่อไป!',
    'เป๊ะมากเลย ไปได้สวย!',
  ],
  over: [
    'ใช้เงินเยอะเกินไปแล้วนะ!',
    'ระวังด้วย! งบเกินแล้ว',
    'โอ้โห ใช้หนักไปหน่อยนะเดือนนี้',
  ],
  default: ['ยังไม่ได้ตั้งงบประมาณเดือนนี้'],
}

export function randomMessage(key: StatusKey): string {
  const msgs = STATUS_MESSAGES[key]
  return msgs[Math.floor(Math.random() * msgs.length)]
}

export function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}
