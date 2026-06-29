import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBudgets } from '@/hooks/useBudgets'
import * as db from '@/lib/db'
import type { Budget, Category } from '@/lib/types'

vi.mock('@/lib/db', () => ({
  fetchBudgets:           vi.fn(),
  fetchMostRecentBudgets: vi.fn(),
  upsertBudget:           vi.fn(),
}))

function budget(categoryId: string, year: number, month: number, amount: number): Budget {
  return {
    id: `${categoryId}-${year}-${month}`,
    user_id: 'u1',
    category_id: categoryId,
    year,
    month,
    amount,
    updated_at: '2026-06-01T00:00:00Z',
  }
}

function category(id: string, type: 'expense' | 'income' = 'expense'): Category {
  return {
    id,
    user_id: 'u1',
    name: id,
    type,
    is_deleted: false,
    usage_count: 0,
    created_at: '2026-06-01T00:00:00Z',
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(db.upsertBudget).mockResolvedValue(undefined)
})

describe('useBudgets — happy path', () => {
  it('loads existing budgets for the given month without auto-copy', async () => {
    const rows = [budget('c1', 2026, 6, 1000), budget('c2', 2026, 6, 500)]
    vi.mocked(db.fetchBudgets).mockResolvedValueOnce(rows)

    const { result } = renderHook(() => useBudgets('u1', 2026, 6))
    await act(async () => {})

    expect(result.current.budgets).toEqual(rows)
    expect(result.current.loading).toBe(false)
    expect(db.fetchMostRecentBudgets).not.toHaveBeenCalled()
  })
})

describe('useBudgets — auto-copy', () => {
  it('copies from the most recent prior month when the target month is empty', async () => {
    const priorRows = [budget('c1', 2026, 5, 1000), budget('c2', 2026, 5, 200)]
    const copiedRows = [budget('c1', 2026, 6, 1000), budget('c2', 2026, 6, 200)]

    vi.mocked(db.fetchBudgets)
      .mockResolvedValueOnce([])          // initial fetch for June — empty
      .mockResolvedValueOnce(copiedRows)  // re-fetch after upserts
    vi.mocked(db.fetchMostRecentBudgets).mockResolvedValueOnce(priorRows)

    const { result } = renderHook(() => useBudgets('u1', 2026, 6))
    await act(async () => {})

    expect(db.upsertBudget).toHaveBeenCalledTimes(2)
    expect(db.upsertBudget).toHaveBeenCalledWith('u1', 'c1', 2026, 6, 1000)
    expect(db.upsertBudget).toHaveBeenCalledWith('u1', 'c2', 2026, 6, 200)
    expect(result.current.budgets).toEqual(copiedRows)
    expect(result.current.loading).toBe(false)
  })

  it('shows empty budgets when no prior month data exists (first-time user)', async () => {
    vi.mocked(db.fetchBudgets).mockResolvedValueOnce([])
    vi.mocked(db.fetchMostRecentBudgets).mockResolvedValueOnce([])

    const { result } = renderHook(() => useBudgets('u1', 2026, 6))
    await act(async () => {})

    expect(db.upsertBudget).not.toHaveBeenCalled()
    expect(result.current.budgets).toEqual([])
    expect(result.current.loading).toBe(false)
  })
})

describe('useBudgets — race condition', () => {
  it('discards the stale month when navigating quickly', async () => {
    let resolveMayFetch!: (v: Budget[]) => void
    let resolveJuneFetch!: (v: Budget[]) => void

    const juneRows = [budget('c1', 2026, 6, 999)]

    // May fetch held; June fetch held — released in reverse order
    vi.mocked(db.fetchBudgets)
      .mockImplementationOnce(() => new Promise((r) => { resolveMayFetch  = r }))
      .mockImplementationOnce(() => new Promise((r) => { resolveJuneFetch = r }))
    // fetchMostRecentBudgets should never be called (race guard exits early for May;
    // June has data so no auto-copy needed)
    vi.mocked(db.fetchMostRecentBudgets).mockResolvedValue([])

    const { result, rerender } = renderHook(
      ({ month }: { month: number }) => useBudgets('u1', 2026, month),
      { initialProps: { month: 5 } },
    )

    // Switch to June while May is still in flight
    rerender({ month: 6 })

    // June resolves first with real data
    await act(async () => { resolveJuneFetch(juneRows) })

    // Stale May fetch finally resolves (empty) — the race guard (seq check) discards it
    // before it can trigger auto-copy, so fetchMostRecentBudgets is never called
    await act(async () => { resolveMayFetch([]) })

    expect(result.current.budgets).toEqual(juneRows)
    expect(result.current.loading).toBe(false)
    expect(db.fetchMostRecentBudgets).not.toHaveBeenCalled()
  })
})

describe('useBudgets — setBudget', () => {
  it('updates an existing category amount optimistically', async () => {
    const rows = [budget('c1', 2026, 6, 1000)]
    vi.mocked(db.fetchBudgets).mockResolvedValueOnce(rows)

    const { result } = renderHook(() => useBudgets('u1', 2026, 6))
    await act(async () => {})

    await act(async () => { await result.current.setBudget('c1', 2000) })

    expect(db.upsertBudget).toHaveBeenCalledWith('u1', 'c1', 2026, 6, 2000)
    expect(result.current.budgets[0].amount).toBe(2000)
  })

  it('appends a new entry with correct year/month for an unseen category', async () => {
    vi.mocked(db.fetchBudgets).mockResolvedValueOnce([budget('c1', 2026, 6, 1000)])

    const { result } = renderHook(() => useBudgets('u1', 2026, 6))
    await act(async () => {})

    await act(async () => { await result.current.setBudget('c2', 500) })

    const newEntry = result.current.budgets.find((b) => b.category_id === 'c2')
    expect(newEntry).toBeDefined()
    expect(newEntry?.year).toBe(2026)
    expect(newEntry?.month).toBe(6)
    expect(newEntry?.amount).toBe(500)
  })
})

describe('useBudgets — totalBudget', () => {
  it('excludes budgets for soft-deleted or inactive categories', async () => {
    const rows = [budget('c1', 2026, 6, 1000), budget('c2', 2026, 6, 200)]
    vi.mocked(db.fetchBudgets).mockResolvedValueOnce(rows)

    // Only c1 is active; c2 is absent from the categories list (soft-deleted)
    const cats = [category('c1', 'expense')]

    const { result } = renderHook(() => useBudgets('u1', 2026, 6, cats))
    await act(async () => {})

    expect(result.current.totalBudget).toBe(1000)
  })

  it('includes all budgets when no categories filter is provided', async () => {
    const rows = [budget('c1', 2026, 6, 1000), budget('c2', 2026, 6, 200)]
    vi.mocked(db.fetchBudgets).mockResolvedValueOnce(rows)

    const { result } = renderHook(() => useBudgets('u1', 2026, 6))
    await act(async () => {})

    expect(result.current.totalBudget).toBe(1200)
  })
})
