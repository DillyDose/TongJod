import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FormPage from '@/app/form/page'
import * as db from '@/lib/db'
import type { Transaction, Category } from '@/lib/types'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/form',
  // Reads the real jsdom URL so tests can simulate query changes
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

function tx(id: string, amount: number): Transaction {
  return {
    id,
    user_id: 'u1',
    type: 'expense',
    amount,
    category_id: 'c1',
    note: null,
    date: '2026-06-10',
    created_at: '2026-06-10T10:00:00Z',
  }
}

/** Confirm rows render as `฿` + amount in one span — match by full text content. */
function amountTexts(value: string) {
  return screen.queryAllByText(
    (_, el) => el?.textContent === value && (el?.children.length ?? 0) === 0,
  )
}

function clickBackArrow() {
  const btn = document.querySelector('svg.lucide-arrow-left')?.closest('button')
  expect(btn).toBeTruthy()
  fireEvent.click(btn!)
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.setItem('tj_lang', 'en')
  window.history.replaceState(null, '', '/form')
  vi.mocked(db.fetchCategories).mockResolvedValue([foodCat])
  vi.mocked(db.fetchLatestTransaction).mockResolvedValue(tx('tx1', 100))
  vi.mocked(db.fetchRecentTransactions).mockResolvedValue([])
  vi.mocked(db.fetchTransactionById).mockResolvedValue(tx('tx9', 777))
  vi.mocked(db.updateTransaction).mockResolvedValue(undefined)
})

describe('form edit mode', () => {
  it('resets to a fresh entry when the edit query param is removed (tapping the + tab)', async () => {
    window.history.replaceState(null, '', '/form?edit=tx9')
    const { rerender } = render(<FormPage />)

    // Edit mode prefilled: lands on the confirm step showing the old amount
    await screen.findByText('Confirm entry')
    expect(amountTexts('฿777').length).toBeGreaterThan(0)

    // User taps the "+" tab → same route without ?edit
    window.history.replaceState(null, '', '/form')
    rerender(<FormPage />)

    // Must be back on a blank amount step, not the stale confirm screen
    await screen.findByText('Enter the amount')
    expect(screen.getByPlaceholderText('0')).toHaveValue('')
    expect(screen.queryByText('Confirm entry')).toBeNull()
  })

  it('keeps latestTx fresh after an update and omits user_id from the payload', async () => {
    render(<FormPage />)

    // Start editing the latest entry (amount 100)
    fireEvent.click(await screen.findByText(/Edit last entry/))
    await screen.findByText('Confirm entry')
    expect(amountTexts('฿100').length).toBeGreaterThan(0)

    // Walk back to the amount step and change 100 → 250
    clickBackArrow() // 5 → 4 details (note + date)
    await screen.findByText('Extra details')
    clickBackArrow() // 4 → 3 category
    await screen.findByText('Choose a category')
    clickBackArrow() // 3 → 2 amount
    const input = await screen.findByPlaceholderText('0')
    expect(input).toHaveValue('100')
    fireEvent.change(input, { target: { value: '250' } })
    fireEvent.click(screen.getByText(/Continue/))

    // Forward through category / details back to confirm
    fireEvent.click(await screen.findByText(/อาหาร/))
    await screen.findByText('Extra details')
    fireEvent.click(screen.getByText(/Continue/))
    await screen.findByText('Confirm entry')
    expect(amountTexts('฿250').length).toBeGreaterThan(0)

    fireEvent.click(screen.getByText('Save'))
    await screen.findByText(/Add another entry/)

    // The update hit the right row, with the new amount and no user_id
    expect(db.updateTransaction).toHaveBeenCalledTimes(1)
    const [updatedId, payload] = vi.mocked(db.updateTransaction).mock.calls[0]
    expect(updatedId).toBe('tx1')
    expect(payload.amount).toBe(250)
    expect(payload).not.toHaveProperty('user_id')

    // "Add another" then "Edit last entry" must prefill the UPDATED amount
    fireEvent.click(screen.getByText(/Add another entry/))
    fireEvent.click(await screen.findByText(/Edit last entry/))
    await screen.findByText('Confirm entry')
    expect(amountTexts('฿250').length).toBeGreaterThan(0)
    expect(amountTexts('฿100')).toHaveLength(0)
  })
})
