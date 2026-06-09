'use client'
import { useState, useEffect } from 'react'
import { fetchBudgets, upsertBudget } from '@/lib/db'
import type { Budget } from '@/lib/types'

export function useBudgets(userId: string | null) {
  const [budgets, setBudgets] = useState<Budget[]>([])

  useEffect(() => {
    if (!userId) return
    fetchBudgets(userId).then(setBudgets)
  }, [userId])

  async function setBudget(categoryId: string, amount: number) {
    if (!userId) return
    await upsertBudget(userId, categoryId, amount)
    setBudgets((prev) => {
      const exists = prev.find((b) => b.category_id === categoryId)
      if (exists) {
        return prev.map((b) => (b.category_id === categoryId ? { ...b, amount } : b))
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          user_id: userId,
          category_id: categoryId,
          amount,
          updated_at: new Date().toISOString(),
        },
      ]
    })
  }

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0)

  return { budgets, setBudget, totalBudget }
}
