import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FormPage from '@/app/form/page'
import * as db from '@/lib/db'
import type { Category } from '@/lib/types'

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

const foodCat: Category = {
  id: 'c1',
  user_id: 'u1',
  name: 'อาหาร',
  type: 'expense',
  is_deleted: false,
  usage_count: 5,
  created_at: '2026-06-01T00:00:00Z',
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.setItem('tj_lang', 'en')
  window.history.replaceState(null, '', '/form')
  vi.mocked(db.fetchCategories).mockResolvedValue([foodCat])
  vi.mocked(db.fetchLatestTransaction).mockResolvedValue(null)
  vi.mocked(db.fetchRecentTransactions).mockResolvedValue([])
})

describe('form new entry', () => {
  it('reaches a working confirm step + Save button without ever touching the date field', async () => {
    render(<FormPage />)

    const input = await screen.findByPlaceholderText('0')
    fireEvent.change(input, { target: { value: '120' } })
    fireEvent.click(screen.getByText(/Continue/))

    fireEvent.click(await screen.findByText(/อาหาร/))

    // Details step: tap Continue via the footer without touching note/date —
    // this is the common path (today's date is already the right default)
    await screen.findByText('Extra details')
    fireEvent.click(screen.getByText(/Continue/))

    // Regression: used to land on a totally blank step 5 (no card, no Save
    // button) because draft.date was never populated unless the user
    // explicitly edited the date field
    await screen.findByText('Confirm entry')
    expect(screen.getByText('Save')).toBeInTheDocument()
  })
})
