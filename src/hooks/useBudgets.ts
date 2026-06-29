'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { fetchBudgets, fetchMostRecentBudgets, upsertBudget } from '@/lib/db'
import type { Budget, Category } from '@/lib/types'

export function useBudgets(
  userId: string | null,
  year: number,
  month: number,
  categories?: Category[],
) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  // Fast month switching can make stale responses arrive after newer ones —
  // only the most recent request may write state
  const requestSeq = useRef(0)

  useEffect(() => {
    if (!userId) return
    const seq = ++requestSeq.current
    setLoading(true)

    void (async () => {
      try {
        const data = await fetchBudgets(userId, year, month)
        if (seq !== requestSeq.current) return

        if (data.length === 0) {
          // Auto-copy: no budgets for this month — clone from most recent prior month
          const prior = await fetchMostRecentBudgets(userId, year, month)
          if (seq !== requestSeq.current) return

          if (prior.length > 0) {
            await Promise.all(
              prior.map((b) => upsertBudget(userId, b.category_id, year, month, b.amount)),
            )
            if (seq !== requestSeq.current) return
            // Re-fetch to get real DB-assigned IDs
            const copied = await fetchBudgets(userId, year, month)
            if (seq !== requestSeq.current) return
            setBudgets(copied)
          } else {
            setBudgets([])
          }
        } else {
          setBudgets(data)
        }
      } finally {
        if (seq === requestSeq.current) setLoading(false)
      }
    })()
  }, [userId, year, month])

  async function setBudget(categoryId: string, amount: number) {
    if (!userId) return
    await upsertBudget(userId, categoryId, year, month, amount)
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
          year,
          month,
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

  return { budgets, setBudget, totalBudget, loading }
}
