import type { Transaction, Category } from './types'

// Suggestion logic for the entry form: quick-add templates derived from
// the user's recent transaction history.

export interface Template {
  categoryId: string
  amount: number
  count: number
  /** created_at of the most recent occurrence */
  lastUsed: string
}

/**
 * Top recurring (category, amount) pairs from recent expense history.
 * A pair must occur at least `minCount` times and belong to a live expense
 * category; ranked by count desc, ties broken by most recent use.
 */
export function frequentTemplates(
  transactions: Transaction[],
  categories: Category[],
  opts: { max?: number; minCount?: number } = {},
): Template[] {
  const { max = 3, minCount = 2 } = opts

  const validCats = new Set(
    categories.filter((c) => c.type === 'expense' && !c.is_deleted).map((c) => c.id),
  )

  const groups = new Map<string, Template>()
  for (const tx of transactions) {
    if (tx.type !== 'expense' || !validCats.has(tx.category_id)) continue
    const key = `${tx.category_id}|${tx.amount}`
    const existing = groups.get(key)
    if (existing) {
      existing.count += 1
      // ISO timestamps compare correctly as strings
      if (tx.created_at > existing.lastUsed) existing.lastUsed = tx.created_at
    } else {
      groups.set(key, {
        categoryId: tx.category_id,
        amount: tx.amount,
        count: 1,
        lastUsed: tx.created_at,
      })
    }
  }

  return [...groups.entries()]
    .filter(([, g]) => g.count >= minCount)
    .sort(([keyA, a], [keyB, b]) => {
      if (b.count !== a.count) return b.count - a.count
      if (b.lastUsed !== a.lastUsed) return b.lastUsed > a.lastUsed ? 1 : -1
      return keyA < keyB ? -1 : 1 // deterministic
    })
    .slice(0, max)
    .map(([, g]) => g)
}
