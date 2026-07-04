import { getSupabase } from './supabase/client'
import type { Transaction, Category, Budget } from './types'

// Profile creation + category seeding happen server-side in
// src/app/auth/callback/route.ts (first-login flow)

export async function fetchTransactions(
  userId: string,
  year: number,
  month: number,
): Promise<Transaction[]> {
  const pad = (n: number) => String(n).padStart(2, '0')
  const from = `${year}-${pad(month)}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const to = `${year}-${pad(month)}-${lastDay}`

  const sb = getSupabase()
  const { data, error } = await sb
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Transaction[]
}

export async function fetchLatestTransaction(userId: string): Promise<Transaction | null> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as Transaction | null
}

/** Most recent transactions regardless of month — used for quick-template
 *  and time-of-day suggestions on the form. */
export async function fetchRecentTransactions(
  userId: string,
  limit = 200,
): Promise<Transaction[]> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as Transaction[]
}

export async function fetchTransactionById(id: string): Promise<Transaction | null> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('transactions')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as Transaction | null
}

export async function insertTransaction(
  tx: Omit<Transaction, 'id' | 'created_at'>,
  opts?: { bumpUsage?: boolean },
): Promise<Transaction> {
  const sb = getSupabase()
  const { data, error } = await sb.from('transactions').insert(tx).select().single()
  if (error) throw error
  // Increment usage count via DB function (defined in migration);
  // skipped for undo re-inserts so usage stats aren't double-counted
  if (opts?.bumpUsage !== false) {
    await sb.rpc('increment_usage', { cat_id: tx.category_id })
  }
  return data as Transaction
}

export async function deleteTransaction(id: string): Promise<void> {
  const sb = getSupabase()
  const { error } = await sb.from('transactions').delete().eq('id', id)
  if (error) throw error
}

export async function updateTransaction(
  id: string,
  tx: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>,
): Promise<void> {
  const sb = getSupabase()
  const { error } = await sb.from('transactions').update(tx).eq('id', id)
  if (error) throw error
}

export async function fetchCategories(userId: string): Promise<Category[]> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('usage_count', { ascending: false })
  if (error) throw error
  return data as Category[]
}

export async function insertCategory(
  userId: string,
  name: string,
  type: 'income' | 'expense',
): Promise<Category> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('categories')
    .insert({ user_id: userId, name, type })
    .select()
    .single()
  if (error) throw error
  return data as Category
}

export async function softDeleteCategory(id: string): Promise<void> {
  const sb = getSupabase()
  const { error } = await sb.from('categories').update({ is_deleted: true }).eq('id', id)
  if (error) throw error
}

export async function restoreCategory(id: string): Promise<void> {
  const sb = getSupabase()
  const { error } = await sb.from('categories').update({ is_deleted: false }).eq('id', id)
  if (error) throw error
}

export async function fetchBudgets(userId: string, year: number, month: number): Promise<Budget[]> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .eq('year', year)
    .eq('month', month)
  if (error) throw error
  return data as Budget[]
}

export async function fetchMostRecentBudgets(
  userId: string,
  beforeYear: number,
  beforeMonth: number,
): Promise<Budget[]> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('year',  { ascending: false })
    .order('month', { ascending: false })
  if (error) throw error
  const all = data as Budget[]
  const target = beforeYear * 12 + beforeMonth
  const pivot = all.find((b) => b.year * 12 + b.month < target)
  if (!pivot) return []
  return all.filter((b) => b.year === pivot.year && b.month === pivot.month)
}

export async function upsertBudget(
  userId: string,
  categoryId: string,
  year: number,
  month: number,
  amount: number,
): Promise<void> {
  const sb = getSupabase()
  const { error } = await sb.from('budgets').upsert(
    { user_id: userId, category_id: categoryId, year, month, amount, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,category_id,year,month' },
  )
  if (error) throw error
}
