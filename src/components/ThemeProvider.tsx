'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { THEMES, computeStatus, randomMessage } from '@/lib/theme'
import type { Theme, StatusKey } from '@/lib/types'

interface SpendingData {
  totalExpense: number
  totalBudget: number
  expectedPct: number
}

interface ThemeCtx {
  theme: Theme
  statusKey: StatusKey
  statusMessage: string
  setSpendingData: (totalExpense: number, totalBudget: number, expectedPct?: number) => void
}

const ThemeContext = createContext<ThemeCtx>({
  theme: THEMES.default,
  statusKey: 'default',
  statusMessage: '',
  setSpendingData: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

const STATUS_CACHE_KEY = 'tj_status'

function isStatusKey(v: string | null): v is StatusKey {
  return v === 'excellent' || v === 'onTrack' || v === 'over' || v === 'default'
}

function currentExpectedPct(): number {
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  return Math.round((today.getDate() / daysInMonth) * 100)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SpendingData | null>(null)
  // Last known status — restored from localStorage so pages other than the
  // dashboard (which is the only data source) keep the correct theme on reload
  const [cachedKey, setCachedKey] = useState<StatusKey>('default')

  useEffect(() => {
    const stored = localStorage.getItem(STATUS_CACHE_KEY)
    if (isStatusKey(stored)) setCachedKey(stored)
  }, [])

  let statusKey: StatusKey = cachedKey
  if (data) {
    const hasBudget = data.totalBudget > 0
    const actualPct = hasBudget
      ? Math.round((data.totalExpense / data.totalBudget) * 100)
      : 0
    statusKey = computeStatus(actualPct, data.expectedPct, hasBudget)
  }
  const theme = THEMES[statusKey]
  const statusMessage = useMemo(() => randomMessage(statusKey), [statusKey])

  useEffect(() => {
    if (!data) return
    localStorage.setItem(STATUS_CACHE_KEY, statusKey)
    setCachedKey(statusKey)
  }, [data, statusKey])

  useEffect(() => {
    const r = document.documentElement.style
    r.setProperty('--accent', theme.accent)
    r.setProperty('--accent-light', theme.accentLight)
    r.setProperty('--accent-shadow', theme.shadow)
    r.setProperty('--bar', theme.bar)
    r.setProperty('--pill-bg', theme.pillBg)
    r.setProperty('--pill-text', theme.pillText)
    r.setProperty('--card-tint', theme.cardTint)
    r.setProperty('--focus-ring', theme.focusRing)
    r.setProperty('--app-gradient', theme.gradient)
    r.setProperty('--sh-button', `0 4px 0 0 ${theme.shadow}`)
  }, [theme])

  // Stable identity + value bail-out: consumers call this from an effect,
  // so an unstable function or always-new object would loop renders forever
  const setSpendingData = useCallback(
    (totalExpense: number, totalBudget: number, expectedPct?: number) => {
      setData((prev) => {
        const next = {
          totalExpense,
          totalBudget,
          expectedPct: expectedPct ?? currentExpectedPct(),
        }
        if (
          prev &&
          prev.totalExpense === next.totalExpense &&
          prev.totalBudget === next.totalBudget &&
          prev.expectedPct === next.expectedPct
        ) {
          return prev
        }
        return next
      })
    },
    [],
  )

  return (
    <ThemeContext.Provider value={{ theme, statusKey, statusMessage, setSpendingData }}>
      {children}
    </ThemeContext.Provider>
  )
}
