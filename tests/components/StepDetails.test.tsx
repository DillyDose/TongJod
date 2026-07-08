import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepDetails } from '@/components/form/StepDetails'
import { todayISO, yesterdayISO } from '@/lib/dates'

function noteInput() {
  return screen.getByPlaceholderText(/lunch with friends/i)
}

describe('StepDetails (combined note + date step)', () => {
  it('defaults the date to today and Enter works with an empty note', () => {
    const onNext = vi.fn()
    render(<StepDetails lang="en" onNext={onNext} />)

    expect(screen.getByDisplayValue(todayISO())).toBeInTheDocument()

    fireEvent.keyDown(noteInput(), { key: 'Enter' })
    expect(onNext).toHaveBeenCalledWith('', todayISO())
  })

  it('passes a typed note through to onNext', () => {
    const onNext = vi.fn()
    render(<StepDetails lang="en" onNext={onNext} />)

    fireEvent.change(noteInput(), {
      target: { value: 'lunch with team' },
    })
    fireEvent.keyDown(noteInput(), { key: 'Enter' })
    expect(onNext).toHaveBeenCalledWith('lunch with team', todayISO())
  })

  it('Yesterday chip switches the date', () => {
    const onNext = vi.fn()
    render(<StepDetails lang="en" onNext={onNext} />)

    fireEvent.click(screen.getByText('Yesterday'))
    fireEvent.keyDown(noteInput(), { key: 'Enter' })
    expect(onNext).toHaveBeenCalledWith('', yesterdayISO())
  })

  it('prefills note and date from initial props (edit-mode back-walk)', () => {
    const onNext = vi.fn()
    render(
      <StepDetails
        lang="en"
        initialNote="taxi"
        initialDate="2026-06-01"
        onNext={onNext}
      />,
    )

    expect(screen.getByDisplayValue('taxi')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2026-06-01')).toBeInTheDocument()

    fireEvent.keyDown(noteInput(), { key: 'Enter' })
    expect(onNext).toHaveBeenCalledWith('taxi', '2026-06-01')
  })

  it('mirrors changes to onChange as the user types', () => {
    const onChange = vi.fn()
    render(<StepDetails lang="en" onNext={vi.fn()} onChange={onChange} />)

    fireEvent.change(screen.getByPlaceholderText(/lunch with friends/i), {
      target: { value: 'bts' },
    })
    expect(onChange).toHaveBeenLastCalledWith('bts', todayISO())

    fireEvent.click(screen.getByText('Yesterday'))
    expect(onChange).toHaveBeenLastCalledWith('bts', yesterdayISO())
  })

  it('renders the title in both languages', () => {
    const { unmount } = render(<StepDetails lang="en" onNext={vi.fn()} />)
    expect(screen.getByText('Extra details')).toBeInTheDocument()
    unmount()

    render(<StepDetails lang="th" onNext={vi.fn()} />)
    expect(screen.getByText('รายละเอียดเพิ่มเติม')).toBeInTheDocument()
  })
})
