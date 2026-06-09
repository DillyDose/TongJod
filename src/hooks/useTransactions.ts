'use client'
import { useState, useEffect, useCallback } from 'react'
import { fetchTransactions, insertTransaction, updateTransaction } from '@/lib/db'
import type { Transaction } from '@/lib/types'

export function useTransactions(userId: string | null, year: number, month: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await fetchTransactions(userId, year, month)
      setTransactions(data)
    } finally {
      setLoading(false)
    }
  }, [userId, year, month])

  useEffect(() => { load() }, [load])

  async function addTransaction(tx: Omit<Transaction, 'id' | 'created_at'>) {
    const saved = await insertTransaction(tx)
    setTransactions((prev) => [saved, ...prev])
  }

  async function editTransaction(
    id: string,
    tx: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>,
  ) {
    await updateTransaction(id, tx)
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...tx } : t)))
  }

  return { transactions, loading, addTransaction, editTransaction, reload: load }
}
