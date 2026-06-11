export type SwipeDirection = 'left' | 'right'
export type SwipeAxis = 'h' | 'v'

const LOCK_SLOP = 10           // px of travel before the gesture's axis is decided
const COMMIT_DISTANCE = 90     // px — releasing beyond this always changes step
const FLICK_VELOCITY = 0.5     // px/ms — a fast flick commits from FLICK_MIN_DISTANCE
const FLICK_MIN_DISTANCE = 30
const RESISTANCE = 3           // divisor for rubber-banding a disabled direction

/** Decide whether a gesture is a horizontal swipe or a vertical scroll.
 *  Returns null while total movement is still inside the slop zone.
 *  Ties go to vertical so scrolling is never hijacked. */
export function lockAxis(dx: number, dy: number): SwipeAxis | null {
  if (Math.abs(dx) < LOCK_SLOP && Math.abs(dy) < LOCK_SLOP) return null
  return Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
}

/** How far the card moves for a finger travel of dx. Disabled directions
 *  rubber-band at 1/3 so the gesture still gives tactile feedback. */
export function dragOffset(dx: number, enabled: boolean): number {
  return enabled ? dx : dx / RESISTANCE
}

/** Decide commit vs snap-back at finger lift. Commits on a long drag or a
 *  quick flick; a fast yank back toward the start always cancels. */
export function shouldCommitSwipe(dx: number, velocityX: number): SwipeDirection | null {
  if (dx === 0) return null
  const dir: SwipeDirection = dx < 0 ? 'left' : 'right'
  const flickedBack =
    Math.abs(velocityX) >= FLICK_VELOCITY && Math.sign(velocityX) !== Math.sign(dx)
  if (flickedBack) return null
  if (Math.abs(dx) >= COMMIT_DISTANCE) return dir
  if (Math.abs(velocityX) >= FLICK_VELOCITY && Math.abs(dx) >= FLICK_MIN_DISTANCE) return dir
  return null
}
