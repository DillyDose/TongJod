import { getSupabase } from './supabase/client'
import type { Transaction, Category, Budget, Profile } from './types'

export async function getOrCreateProfile(
  userId: string,
  email: string,
  displayName: string,
): Promise<Profile> {
  const sb = getSupabase()
  const { data: existing } = await sb.from('profiles').select('*').eq('id', userId).single()
  if (existing) return existing as Profile

  const { data, error } = await sb
    .from('profiles')
    .insert({ id: userId, email, display_name: displayName })
    .select()
    .single()
  if (error) throw error
  return data as Profile
}

export async function seedCategories(userId: string): Promise<void> {
  const sb = getSupabase()
  const expenseNames = [
    'อาหาร', 'เดินทาง', 'ช้อปปิ้ง', 'บิล/ค่าใช้จ่าย',
    'สุขภาพ', 'บันเทิง', 'กาแฟ', 'อื่นๆ',
  ]
  const incomeNames = ['เงินเดือน', 'ฟรีแลนซ์', 'โบนัส', 'อื่นๆ']
  const rows = [
    ...expenseNames.map((name) => ({ user_id: userId, name, type: 'expense' as const })),
    ...incomeNames.map((name)  => ({ user_id: userId, name, type: 'income'  as const })),
  ]
  const { error } = await sb.from('categories').insert(rows)
  if (error) throw error
}

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

export async function fetchBudgets(userId: string): Promise<Budget[]> {
  const sb = getSupabase()
  const { data, error } = await sb.from('budgets').select('*').eq('user_id', userId)
  if (error) throw error
  return data as Budget[]
}

export async function upsertBudget(
  userId: string,
  categoryId: string,
  amount: number,
): Promise<void> {
  const sb = getSupabase()
  const { error } = await sb.from('budgets').upsert(
    { user_id: userId, category_id: categoryId, amount, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,category_id' },
  )
  if (error) throw error
}
