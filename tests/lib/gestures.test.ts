import { describe, it, expect } from 'vitest'
import { detectSwipe } from '@/lib/gestures'

describe('detectSwipe', () => {
  it('detects a left swipe (finger moves left)', () => {
    expect(detectSwipe(-120, 10, 200)).toBe('left')
  })
  it('detects a right swipe (finger moves right)', () => {
    expect(detectSwipe(150, -20, 300)).toBe('right')
  })
  it('ignores short movements (taps)', () => {
    expect(detectSwipe(30, 5, 100)).toBeNull()
    expect(detectSwipe(-59, 0, 100)).toBeNull()
  })
  it('ignores slow drags', () => {
    expect(detectSwipe(-200, 0, 601)).toBeNull()
  })
  it('ignores mostly-vertical movement (scrolling)', () => {
    expect(detectSwipe(80, 80, 200)).toBeNull()    // 1:1 — vertical scroll wins
    expect(detectSwipe(-100, 90, 200)).toBeNull()  // below 1.5x ratio
    expect(detectSwipe(-100, 50, 200)).toBe('left') // 2x ratio — clearly horizontal
  })
  it('accepts gestures exactly at the thresholds', () => {
    expect(detectSwipe(60, 0, 600)).toBe('right')
  })
})
