import { describe, it, expect } from 'vitest'
import { lockAxis, dragOffset, shouldCommitSwipe } from '@/lib/gestures'

describe('lockAxis', () => {
  it('stays undecided inside the slop zone', () => {
    expect(lockAxis(5, 5)).toBeNull()
    expect(lockAxis(-9, 0)).toBeNull()
  })
  it('locks horizontal when x dominates', () => {
    expect(lockAxis(12, 4)).toBe('h')
    expect(lockAxis(-15, -8)).toBe('h')
  })
  it('locks vertical when y dominates or ties (scrolling wins)', () => {
    expect(lockAxis(4, 12)).toBe('v')
    expect(lockAxis(10, 10)).toBe('v')
  })
})

describe('dragOffset', () => {
  it('follows the finger 1:1 when the direction is enabled', () => {
    expect(dragOffset(-80, true)).toBe(-80)
    expect(dragOffset(45, true)).toBe(45)
  })
  it('rubber-bands disabled directions at 1/3', () => {
    expect(dragOffset(-90, false)).toBe(-30)
    expect(dragOffset(60, false)).toBe(20)
  })
})

describe('shouldCommitSwipe', () => {
  it('commits a long drag regardless of speed', () => {
    expect(shouldCommitSwipe(-120, 0)).toBe('left')
    expect(shouldCommitSwipe(95, 0.1)).toBe('right')
  })
  it('commits a quick flick after modest travel', () => {
    expect(shouldCommitSwipe(-40, -0.8)).toBe('left')
    expect(shouldCommitSwipe(35, 0.6)).toBe('right')
  })
  it('snaps back on short slow drags', () => {
    expect(shouldCommitSwipe(-50, -0.2)).toBeNull()
    expect(shouldCommitSwipe(0, 0)).toBeNull()
  })
  it('snaps back on a fast flick with almost no travel', () => {
    expect(shouldCommitSwipe(-20, -1.2)).toBeNull()
  })
  it('cancels when yanked back toward the start, even after a long drag', () => {
    expect(shouldCommitSwipe(-120, 0.9)).toBeNull()
  })
})
