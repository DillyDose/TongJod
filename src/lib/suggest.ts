import type { Transaction, Category } from './types'

// Suggestion logic for the entry form: quick-add templates and
// time-of-day category ordering, derived from recent transaction history.

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

export type TimeBucket = 'morning' | 'midday' | 'evening' | 'night'

/** morning 05–10 · midday 11–14 · evening 15–20 · night 21–04 */
export function bucketOfHour(hour: number): TimeBucket {
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 15) return 'midday'
  if (hour >= 15 && hour < 21) return 'evening'
  return 'night'
}

/**
 * Reorder categories by how often each is used in the current time-of-day
 * bucket. Falls back to plain usage_count order when the bucket has fewer
 * than `minBucketTx` matching transactions — not enough signal.
 */
export function timeAwareCategoryOrder(
  categories: Category[],
  transactions: Transaction[],
  hour: number,
  opts: { minBucketTx?: number } = {},
): Category[] {
  const { minBucketTx = 3 } = opts
  const bucket = bucketOfHour(hour)
  const catIds = new Set(categories.map((c) => c.id))

  const bucketCounts = new Map<string, number>()
  let bucketTotal = 0
  for (const tx of transactions) {
    if (!catIds.has(tx.category_id)) continue
    // getHours() converts the stored UTC timestamp to the user's local time
    if (bucketOfHour(new Date(tx.created_at).getHours()) !== bucket) continue
    bucketCounts.set(tx.category_id, (bucketCounts.get(tx.category_id) ?? 0) + 1)
    bucketTotal += 1
  }

  const byUsage = [...categories].sort((a, b) => b.usage_count - a.usage_count)
  if (bucketTotal < minBucketTx) return byUsage

  return byUsage.sort(
    (a, b) => (bucketCounts.get(b.id) ?? 0) - (bucketCounts.get(a.id) ?? 0),
  )
}
