export type SwipeDirection = 'left' | 'right'

const MIN_DISTANCE = 60   // px of horizontal travel
const MAX_DURATION = 600  // ms — slower drags are scrolling, not swiping
const AXIS_RATIO = 1.5    // horizontal must dominate vertical by this factor

/** Classify a touch gesture from its total deltas. Returns null when the
 *  movement is too short, too slow, or mostly vertical (scrolling). */
export function detectSwipe(
  dx: number,
  dy: number,
  elapsedMs: number,
): SwipeDirection | null {
  if (elapsedMs > MAX_DURATION) return null
  if (Math.abs(dx) < MIN_DISTANCE) return null
  if (Math.abs(dx) < AXIS_RATIO * Math.abs(dy)) return null
  return dx < 0 ? 'left' : 'right'
}
