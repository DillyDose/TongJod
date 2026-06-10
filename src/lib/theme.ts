import type { StatusKey, Theme } from './types'

export const THEMES: Record<StatusKey, Theme> = {
  excellent: {
    key: 'excellent',
    gradient: 'linear-gradient(135deg, #58CC02 0%, #4aaa00 100%)',
    accent: '#58CC02',
    accentLight: '#89E219',
    shadow: '#58A700',
    cardTint: 'rgba(88, 204, 2, 0.08)',
    bar: '#58CC02',
    pillBg: '#DCFCE7',
    pillText: '#15803D',
    focusRing: 'rgba(88, 204, 2, 0.20)',
  },
  onTrack: {
    key: 'onTrack',
    gradient: 'linear-gradient(135deg, #FF9600 0%, #D47900 100%)',
    accent: '#FF9600',
    accentLight: '#FFC800',
    shadow: '#D47900',
    cardTint: 'rgba(255, 150, 0, 0.08)',
    bar: '#FF9600',
    pillBg: '#FEF3C7',
    pillText: '#92400E',
    focusRing: 'rgba(255, 150, 0, 0.20)',
  },
  over: {
    key: 'over',
    gradient: 'linear-gradient(135deg, #FF4B4B 0%, #D43333 100%)',
    accent: '#FF4B4B',
    accentLight: '#FF7070',
    shadow: '#D43333',
    cardTint: 'rgba(255, 75, 75, 0.08)',
    bar: '#FF4B4B',
    pillBg: '#FEE2E2',
    pillText: '#DC2626',
    focusRing: 'rgba(255, 75, 75, 0.20)',
  },
  default: {
    key: 'default',
    gradient: 'linear-gradient(135deg, #4B7BE5 0%, #3B5FBB 100%)',
    accent: '#4B7BE5',
    accentLight: '#7BA3F5',
    shadow: '#3B5FBB',
    cardTint: 'rgba(75, 123, 229, 0.08)',
    bar: '#4B7BE5',
    pillBg: '#EFF6FF',
    pillText: '#1D4ED8',
    focusRing: 'rgba(75, 123, 229, 0.20)',
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
