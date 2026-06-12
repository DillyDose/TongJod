import { describe, it, expect } from 'vitest'
import { frequentTemplates, bucketOfHour, timeAwareCategoryOrder } from '@/lib/suggest'
import type { Transaction, Category } from '@/lib/types'

function cat(over: Partial<Category> = {}): Category {
  return {
    id: 'c1',
    user_id: 'u1',
    name: 'อาหาร',
    type: 'expense',
    is_deleted: false,
    usage_count: 5,
    created_at: '2026-01-01T00:00:00Z',
    ...over,
  }
}

let txSeq = 0
function tx(over: Partial<Transaction> = {}): Transaction {
  txSeq += 1
  return {
    id: `t${txSeq}`,
    user_id: 'u1',
    type: 'expense',
    amount: 50,
    category_id: 'c1',
    note: null,
    date: '2026-06-10',
    created_at: '2026-06-10T10:00:00Z',
    ...over,
  }
}

describe('frequentTemplates', () => {
  const cats = [cat({ id: 'c1' }), cat({ id: 'c2', name: 'เดินทาง' })]

  it('returns the top pairs ranked by count', () => {
    const txs = [
      // (c1, 45) ×3 — top
      tx({ category_id: 'c1', amount: 45 }),
      tx({ category_id: 'c1', amount: 45 }),
      tx({ category_id: 'c1', amount: 45 }),
      // (c2, 32) ×2
      tx({ category_id: 'c2', amount: 32 }),
      tx({ category_id: 'c2', amount: 32 }),
      // (c1, 60) ×1 — below minCount, excluded
      tx({ category_id: 'c1', amount: 60 }),
    ]
    const result = frequentTemplates(txs, cats)
    expect(result.map((r) => [r.categoryId, r.amount, r.count])).toEqual([
      ['c1', 45, 3],
      ['c2', 32, 2],
    ])
  })

  it('treats the same category with different amounts as separate templates', () => {
    const txs = [
      tx({ category_id: 'c1', amount: 45 }),
      tx({ category_id: 'c1', amount: 45 }),
      tx({ category_id: 'c1', amount: 120 }),
      tx({ category_id: 'c1', amount: 120 }),
    ]
    const result = frequentTemplates(txs, cats)
    expect(result).toHaveLength(2)
  })

  it('caps the result at max (default 3)', () => {
    const txs: Transaction[] = []
    for (const amount of [10, 20, 30, 40, 50]) {
      txs.push(tx({ amount }), tx({ amount }))
    }
    expect(frequentTemplates(txs, cats)).toHaveLength(3)
  })

  it('respects a custom minCount', () => {
    const txs = [tx({ amount: 99 })]
    expect(frequentTemplates(txs, cats)).toHaveLength(0)
    expect(frequentTemplates(txs, cats, { minCount: 1 })).toHaveLength(1)
  })

  it('breaks count ties by most recent use', () => {
    const txs = [
      tx({ category_id: 'c1', amount: 45, created_at: '2026-06-01T10:00:00Z' }),
      tx({ category_id: 'c1', amount: 45, created_at: '2026-06-02T10:00:00Z' }),
      tx({ category_id: 'c2', amount: 32, created_at: '2026-06-08T10:00:00Z' }),
      tx({ category_id: 'c2', amount: 32, created_at: '2026-06-09T10:00:00Z' }),
    ]
    const result = frequentTemplates(txs, cats)
    expect(result[0].categoryId).toBe('c2') // same count, used more recently
  })

  it('ignores income transactions and unknown/deleted categories', () => {
    const txs = [
      tx({ type: 'income', category_id: 'c1', amount: 45 }),
      tx({ type: 'income', category_id: 'c1', amount: 45 }),
      tx({ category_id: 'gone', amount: 80 }),
      tx({ category_id: 'gone', amount: 80 }),
    ]
    expect(frequentTemplates(txs, cats)).toHaveLength(0)
  })

  it('returns [] for empty history', () => {
    expect(frequentTemplates([], cats)).toEqual([])
  })
})

describe('bucketOfHour', () => {
  it('maps hours to the four buckets', () => {
    expect(bucketOfHour(5)).toBe('morning')
    expect(bucketOfHour(10)).toBe('morning')
    expect(bucketOfHour(11)).toBe('midday')
    expect(bucketOfHour(14)).toBe('midday')
    expect(bucketOfHour(15)).toBe('evening')
    expect(bucketOfHour(20)).toBe('evening')
    expect(bucketOfHour(21)).toBe('night')
    expect(bucketOfHour(4)).toBe('night')
    expect(bucketOfHour(0)).toBe('night')
  })
})

describe('timeAwareCategoryOrder', () => {
  // NOTE: created_at strings here have NO timezone suffix on purpose —
  // per ECMA-262 they parse as LOCAL time, so getHours() is deterministic
  // in any test-runner timezone.
  const catA = cat({ id: 'a', name: 'A', usage_count: 10 })
  const catB = cat({ id: 'b', name: 'B', usage_count: 2 })
  const cats = [catA, catB]

  const morningTx = (categoryId: string) =>
    tx({ category_id: categoryId, created_at: '2026-06-10T08:30:00' })

  it('falls back to usage_count order when the bucket has too little data', () => {
    const txs = [morningTx('b'), morningTx('b')] // only 2 < minBucketTx 3
    expect(timeAwareCategoryOrder(cats, txs, 8).map((c) => c.id)).toEqual(['a', 'b'])
  })

  it('promotes the category used most in the current time bucket', () => {
    const txs = [morningTx('b'), morningTx('b'), morningTx('b')]
    expect(timeAwareCategoryOrder(cats, txs, 8).map((c) => c.id)).toEqual(['b', 'a'])
  })

  it('falls back at an hour outside the data bucket', () => {
    const txs = [morningTx('b'), morningTx('b'), morningTx('b')]
    // 19:00 = evening; no evening tx → usage_count order
    expect(timeAwareCategoryOrder(cats, txs, 19).map((c) => c.id)).toEqual(['a', 'b'])
  })

  it('breaks bucket-count ties by usage_count', () => {
    const txs = [
      morningTx('a'), morningTx('a'),
      morningTx('b'), morningTx('b'),
    ]
    expect(timeAwareCategoryOrder(cats, txs, 8).map((c) => c.id)).toEqual(['a', 'b'])
  })

  it('handles empty history and never mutates inputs', () => {
    const original = [...cats]
    expect(timeAwareCategoryOrder(cats, [], 8).map((c) => c.id)).toEqual(['a', 'b'])
    expect(cats).toEqual(original)
  })
})
