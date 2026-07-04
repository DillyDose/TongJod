import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FormPage from '@/app/form/page'
import * as db from '@/lib/db'
import { todayISO } from '@/lib/dates'
import type { Transaction, Category } from '@/lib/types'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/form',
  useSearchParams: () => new URLSearchParams(window.location.search),
}))

vi.mock('@/lib/supabase/client', () => ({
  getSupabase: () => ({
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'u1' } } }),
      signOut: vi.fn(),
    },
  }),
}))

vi.mock('@/lib/db', () => ({
  insertTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  fetchLatestTransaction: vi.fn(),
  fetchTransactionById: vi.fn(),
  fetchRecentTransactions: vi.fn(),
  fetchCategories: vi.fn(),
  insertCategory: vi.fn(),
  softDeleteCategory: vi.fn(),
  restoreCategory: vi.fn(),
}))

const coffeeCat: Category = {
  id: 'c1',
  user_id: 'u1',
  name: 'กาแฟ',
  type: 'expense',
  is_deleted: false,
  usage_count: 9,
  created_at: '2026-01-01T00:00:00Z',
}

let txSeq = 0
function tx(over: Partial<Transaction> = {}): Transaction {
  txSeq += 1
  return {
    id: `t${txSeq}`,
    user_id: 'u1',
    type: 'expense',
    amount: 55,
    category_id: 'c1',
    note: null,
    date: '2026-06-10',
    created_at: '2026-06-10T10:00:00Z',
    ...over,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.setItem('tj_lang', 'en')
  window.history.replaceState(null, '', '/form')
  vi.mocked(db.fetchCategories).mockResolvedValue([coffeeCat])
  vi.mocked(db.fetchLatestTransaction).mockResolvedValue(null)
  vi.mocked(db.fetchRecentTransactions).mockResolvedValue([])
  vi.mocked(db.insertTransaction).mockResolvedValue(tx({ id: 'new1' }))
})

describe('quick-add template chips', () => {
  it('renders a chip for a recurring pair; tapping it lands on confirm and saves with today date', async () => {
    vi.mocked(db.fetchRecentTransactions).mockResolvedValue([
      tx({ amount: 55 }),
      tx({ amount: 55 }),
    ])
    render(<FormPage />)

    // Chip appears on the amount step
    await screen.findByText('Quick add')
    const chip = await screen.findByText('฿55')
    fireEvent.click(chip)

    // Straight to confirm with everything prefilled
    await screen.findByText('Confirm entry')
    fireEvent.click(screen.getByText('Save'))
    await screen.findByText(/Add another entry/)

    expect(db.insertTransaction).toHaveBeenCalledTimes(1)
    const [payload] = vi.mocked(db.insertTransaction).mock.calls[0]
    expect(payload).toMatchObject({
      user_id: 'u1',
      type: 'expense',
      amount: 55,
      category_id: 'c1',
      note: null,
      date: todayISO(),
    })
  })

  it('shows no chips when history has no recurring pair', async () => {
    vi.mocked(db.fetchRecentTransactions).mockResolvedValue([tx({ amount: 55 })])
    render(<FormPage />)

    await screen.findByText('Enter the amount')
    expect(screen.queryByText('Quick add')).toBeNull()
  })

  it('shows no chips in edit mode', async () => {
    vi.mocked(db.fetchRecentTransactions).mockResolvedValue([
      tx({ amount: 55 }),
      tx({ amount: 55 }),
    ])
    vi.mocked(db.fetchTransactionById).mockResolvedValue(tx({ id: 'tx9', amount: 777 }))
    window.history.replaceState(null, '', '/form?edit=tx9')
    render(<FormPage />)

    await screen.findByText('Confirm entry')

    // Walk back to the amount step: confirm → details → category → amount
    const back = () => {
      const btn = document.querySelector('svg.lucide-arrow-left')?.closest('button')
      fireEvent.click(btn!)
    }
    back()
    await screen.findByText('Extra details')
    back()
    await screen.findByText('Choose a category')
    back()
    await screen.findByText('Enter the amount')

    expect(screen.queryByText('Quick add')).toBeNull()
  })
})
