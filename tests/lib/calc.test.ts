import { describe, it, expect } from 'vitest'
import { hasOperator, evalAmountExpression } from '@/lib/calc'

describe('evalAmountExpression', () => {
  it('evaluates plain numbers', () => {
    expect(evalAmountExpression('100')).toBe(100)
    expect(evalAmountExpression('100.50')).toBe(100.5)
  })

  it('sums additions left to right', () => {
    expect(evalAmountExpression('120+45+30')).toBe(195)
  })

  it('handles subtraction', () => {
    expect(evalAmountExpression('200-50')).toBe(150)
    expect(evalAmountExpression('200-50+10')).toBe(160)
  })

  it('rejects zero and negative results', () => {
    expect(evalAmountExpression('50-100')).toBeNull()
    expect(evalAmountExpression('100-100')).toBeNull()
  })

  it('ignores spaces', () => {
    expect(evalAmountExpression(' 1 00 + 5 ')).toBe(105)
  })

  it('rounds floating point noise to 2 decimals', () => {
    expect(evalAmountExpression('0.1+0.2')).toBe(0.3)
  })

  it('returns null for invalid expressions', () => {
    expect(evalAmountExpression('')).toBeNull()
    expect(evalAmountExpression('abc')).toBeNull()
    expect(evalAmountExpression('100+')).toBeNull()
    expect(evalAmountExpression('+100')).toBeNull()
    expect(evalAmountExpression('-50')).toBeNull()
    expect(evalAmountExpression('1++2')).toBeNull()
    expect(evalAmountExpression('1.2.3')).toBeNull()
    expect(evalAmountExpression('12e3')).toBeNull()
  })
})

describe('hasOperator', () => {
  it('detects an operator after a digit', () => {
    expect(hasOperator('100+5')).toBe(true)
    expect(hasOperator('100-5')).toBe(true)
    expect(hasOperator('100+')).toBe(true)
  })

  it('is false for plain numbers and leading signs', () => {
    expect(hasOperator('100')).toBe(false)
    expect(hasOperator('+100')).toBe(false)
    expect(hasOperator('')).toBe(false)
  })
})
