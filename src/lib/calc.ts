// Tiny +/- expression evaluator for the amount input ("120+45+30").
// Only + and - on purpose: the use case is summing receipt line items,
// and left-to-right evaluation needs no precedence rules.

/** True when the string is an arithmetic expression (an operator appears after a digit). */
export function hasOperator(s: string): boolean {
  return /\d[+-]/.test(s)
}

/**
 * Evaluate a +/- expression like "120+45+30" left to right.
 * Spaces are ignored. Returns null for anything invalid, or a result <= 0.
 * Rounded to 2 decimals to absorb floating-point noise (0.1+0.2).
 */
export function evalAmountExpression(s: string): number | null {
  const expr = s.replace(/\s+/g, '')
  if (!/^\d*\.?\d+([+-]\d*\.?\d+)*$/.test(expr)) return null

  const terms = expr.match(/[+-]?\d*\.?\d+/g)
  if (!terms) return null

  const total = terms.reduce((sum, term) => sum + Number(term), 0)
  if (!Number.isFinite(total) || total <= 0) return null
  return Math.round(total * 100) / 100
}
