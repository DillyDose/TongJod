import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTransactions } from '@/hooks/useTransactions'
import * as db from '@/lib/db'
import type { Transaction } from '@/lib/types'

vi.mock('@/lib/db', () => ({
  fetchTransactions: vi.fn(),
  insertTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
}))

function tx(id: string, date: string): Transaction {
  return {
    id,
    user_id: 'u1',
    type: 'expense',
    amount: 100,
    category_id: 'c1',
    note: null,
    date,
    created_at: `${date}T10:00:00Z`,
  }
}

describe('useTransactions month-switch race', () => {
  it('keeps the latest requested month when responses arrive out of order', async () => {
    let resolveMay!: (v: Transaction[]) => void
    let resolveJune!: (v: Transaction[]) => void
    vi.mocked(db.fetchTransactions)
      .mockImplementationOnce(() => new Promise((r) => { resolveMay = r }))
      .mockImplementationOnce(() => new Promise((r) => { resolveJune = r }))

    const { result, rerender } = renderHook(
      ({ month }: { month: number }) => useTransactions('u1', 2026, month),
      { initialProps: { month: 5 } },
    )
    rerender({ month: 6 }) // switch month while May is still in flight

    // June (the month on screen) answers first…
    await act(async () => { resolveJune([tx('june-tx', '2026-06-10')]) })
    // …then the stale May response lands late
    await act(async () => { resolveMay([tx('may-tx', '2026-05-10')]) })

    expect(result.current.transactions.map((t) => t.id)).toEqual(['june-tx'])
    expect(result.current.loading).toBe(false)
  })
})
