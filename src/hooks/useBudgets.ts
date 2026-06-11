'use client'
import { useState, useEffect, useMemo } from 'react'
import { fetchBudgets, upsertBudget } from '@/lib/db'
import type { Budget, Category } from '@/lib/types'

export function useBudgets(userId: string | null, categories?: Category[]) {
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

  // Only count budgets whose category is still active (not soft-deleted),
  // otherwise deleted categories keep inflating the total forever
  const totalBudget = useMemo(() => {
    const active = categories
      ? new Set(categories.filter((c) => c.type === 'expense').map((c) => c.id))
      : null
    return budgets
      .filter((b) => !active || active.has(b.category_id))
      .reduce((s, b) => s + b.amount, 0)
  }, [budgets, categories])

  return { budgets, setBudget, totalBudget }
}
