import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { TopCategories } from '@/components/dashboard/TopCategories'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

describe('EN mode shows no hardcoded Thai strings', () => {
  it('SummaryCards shows the THB unit label in English', () => {
    render(<SummaryCards transactions={[]} daysInMonth={30} lang="en" />)
    expect(screen.getAllByText('THB').length).toBeGreaterThan(0)
    expect(screen.queryByText('บาท')).toBeNull()
  })

  it('TopCategories shows the empty state in English', () => {
    render(<TopCategories transactions={[]} categories={[]} lang="en" />)
    expect(screen.getByText('No expenses this month')).toBeInTheDocument()
    expect(screen.queryByText('ยังไม่มีรายจ่ายเดือนนี้')).toBeNull()
  })

  it('TopCategories keeps the Thai empty state in Thai mode', () => {
    render(<TopCategories transactions={[]} categories={[]} lang="th" />)
    expect(screen.getByText('ยังไม่มีรายจ่ายเดือนนี้')).toBeInTheDocument()
  })
})
