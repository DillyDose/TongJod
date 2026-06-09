'use client'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { THEMES, computeStatus, randomMessage } from '@/lib/theme'
import type { Theme, StatusKey } from '@/lib/types'

interface ThemeCtx {
  theme: Theme
  statusKey: StatusKey
  statusMessage: string
  setSpendingData: (totalExpense: number, totalBudget: number) => void
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const daysElapsed = today.getDate()
  const expectedPct = Math.round((daysElapsed / daysInMonth) * 100)

  const [totalExpense, setTotalExpense] = useState(0)
  const [totalBudget, setTotalBudget] = useState(0)

  const hasBudget = totalBudget > 0
  const actualPct = hasBudget ? Math.round((totalExpense / totalBudget) * 100) : 0
  const statusKey = computeStatus(actualPct, expectedPct, hasBudget)
  const theme = THEMES[statusKey]
  const msgRef = useRef(randomMessage(statusKey))

  useEffect(() => {
    msgRef.current = randomMessage(statusKey)
  }, [statusKey])

  useEffect(() => {
    const r = document.documentElement.style
    r.setProperty('--accent', theme.accent)
    r.setProperty('--accent-light', theme.accentLight)
    r.setProperty('--bar', theme.bar)
    r.setProperty('--pill-bg', theme.pillBg)
    r.setProperty('--pill-text', theme.pillText)
    r.setProperty('--card-tint', theme.cardTint)
    r.setProperty('--focus-ring', theme.focusRing)
    r.setProperty('--app-gradient', theme.gradient)
  }, [theme])

  function setSpendingData(expense: number, budget: number) {
    setTotalExpense(expense)
    setTotalBudget(budget)
  }

  return (
    <ThemeContext.Provider
      value={{ theme, statusKey, statusMessage: msgRef.current, setSpendingData }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
