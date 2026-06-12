'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  fetchTransactions,
  insertTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/lib/db'
import type { Transaction } from '@/lib/types'

export function useTransactions(userId: string | null, year: number, month: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  // Fast month switching can make an older fetch resolve after a newer one —
  // only the most recent request may write state
  const requestSeq = useRef(0)

  const load = useCallback(async () => {
    if (!userId) return
    const seq = ++requestSeq.current
    setLoading(true)
    try {
      const data = await fetchTransactions(userId, year, month)
      if (seq === requestSeq.current) setTransactions(data)
    } finally {
      if (seq === requestSeq.current) setLoading(false)
    }
  }, [userId, year, month])

  useEffect(() => { load() }, [load])

  async function addTransaction(
    tx: Omit<Transaction, 'id' | 'created_at'>,
    opts?: { bumpUsage?: boolean },
  ): Promise<Transaction> {
    const saved = await insertTransaction(tx, opts)
    setTransactions((prev) => [saved, ...prev])
    return saved
  }

  async function editTransaction(
    id: string,
    tx: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>,
  ) {
    await updateTransaction(id, tx)
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...tx } : t)))
  }

  async function removeTransaction(id: string) {
    await deleteTransaction(id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return { transactions, loading, addTransaction, editTransaction, removeTransaction, reload: load }
}
