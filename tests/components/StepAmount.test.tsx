import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepAmount } from '@/components/form/StepAmount'

function input() {
  return screen.getByPlaceholderText('0')
}

describe('StepAmount calculator input', () => {
  it('shows the live total for an expression and commits the evaluated result on Enter', () => {
    const onNext = vi.fn()
    render(<StepAmount lang="en" onNext={onNext} />)

    fireEvent.change(input(), { target: { value: '120+45+30' } })
    expect(screen.getByText('= ฿195')).toBeInTheDocument()

    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(onNext).toHaveBeenCalledWith('195')
  })

  it('does not commit on Enter while the expression is incomplete', () => {
    const onNext = vi.fn()
    render(<StepAmount lang="en" onNext={onNext} />)

    fireEvent.change(input(), { target: { value: '100+' } })
    expect(screen.getByText('= —')).toBeInTheDocument()

    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(onNext).not.toHaveBeenCalled()
  })

  it('plain numbers still work with no result line', () => {
    const onNext = vi.fn()
    render(<StepAmount lang="en" onNext={onNext} />)

    fireEvent.change(input(), { target: { value: '250' } })
    expect(screen.queryByText(/^=/)).toBeNull()

    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(onNext).toHaveBeenCalledWith('250')
  })

  it('operator chips append only when valid', () => {
    render(<StepAmount lang="en" onNext={vi.fn()} />)

    // no-op on empty value
    fireEvent.click(screen.getByLabelText('plus'))
    expect(input()).toHaveValue('')

    fireEvent.change(input(), { target: { value: '50' } })
    fireEvent.click(screen.getByLabelText('plus'))
    expect(input()).toHaveValue('50+')

    // no-op when already ending with an operator
    fireEvent.click(screen.getByLabelText('minus'))
    expect(input()).toHaveValue('50+')
  })

  it('strips characters that are not digits, dot or operators', () => {
    render(<StepAmount lang="en" onNext={vi.fn()} />)

    fireEvent.change(input(), { target: { value: '12a+3x' } })
    expect(input()).toHaveValue('12+3')
  })
})
