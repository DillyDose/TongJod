'use client'
import { useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { lockAxis, dragOffset, shouldCommitSwipe, type SwipeAxis } from '@/lib/gestures'

interface Props {
  step: number
  totalSteps: number
  onBack: () => void
  children: React.ReactNode
  animDir: 'forward' | 'back'
  /** Swipe left (next step). Omit to disable — the card rubber-bands instead. */
  onSwipeForward?: () => void
  /** Swipe right (previous step). Omit to disable. */
  onSwipeBack?: () => void
}

const FLY_MS = 180
const SNAP_BACK = 'transform 300ms cubic-bezier(.2,.9,.3,1.15), opacity 150ms ease-out'

// A pointerup that ends a drag can still fire a click on whatever element the
// gesture started on (always with a mouse, sometimes on touch) — swallow one.
function suppressNextClick(el: HTMLElement) {
  const swallow = (ev: Event) => {
    ev.preventDefault()
    ev.stopPropagation()
  }
  el.addEventListener('click', swallow, { capture: true, once: true })
  window.setTimeout(() => el.removeEventListener('click', swallow, true), 120)
}

export function FormShell({
  step,
  totalSteps,
  onBack,
  children,
  animDir,
  onSwipeForward,
  onSwipeBack,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{
    id: number
    x: number
    y: number
    axis: SwipeAxis | null
    samples: { x: number; t: number }[]
  } | null>(null)
  const flying = useRef(false)
  const raf = useRef(0)

  function setCard(transform: string, opacity: string, transition = '') {
    const el = cardRef.current
    if (!el) return
    el.style.transition = transition
    el.style.transform = transform
    el.style.opacity = opacity
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (flying.current || !e.isPrimary) return
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      axis: null,
      samples: [{ x: e.clientX, t: performance.now() }],
    }
    // grabbing mid-snap-back: freeze the card where it is
    const el = cardRef.current
    if (el) el.style.transition = ''
  }

  function handlePointerMove(e: React.PointerEvent) {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.axis) {
      d.axis = lockAxis(dx, dy)
      // capture only once the gesture is clearly horizontal, so plain
      // taps keep their normal click behavior
      if (d.axis === 'h') e.currentTarget.setPointerCapture(e.pointerId)
    }
    if (d.axis !== 'h') return
    d.samples.push({ x: e.clientX, t: performance.now() })
    if (d.samples.length > 6) d.samples.shift()
    const enabled = dx < 0 ? !!onSwipeForward : !!onSwipeBack
    const shifted = dragOffset(dx, enabled)
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      setCard(
        `translateX(${shifted}px) rotate(${shifted / 40}deg)`,
        String(Math.max(1 - Math.abs(shifted) / 600, 0.4)),
      )
    })
  }

  function handlePointerUp(e: React.PointerEvent) {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    drag.current = null
    if (d.axis !== 'h') return
    suppressNextClick(e.currentTarget as HTMLElement)
    cancelAnimationFrame(raf.current)

    const dx = e.clientX - d.x
    const now = performance.now()
    // velocity over roughly the last 100ms — so drag-pause-release stays
    // a position decision while a final flick still counts
    const recent = d.samples.find((s) => now - s.t <= 100) ?? d.samples[0]
    const vel = now > recent.t ? (e.clientX - recent.x) / (now - recent.t) : 0
    const dir = shouldCommitSwipe(dx, vel)
    const handler = dir === 'left' ? onSwipeForward : dir === 'right' ? onSwipeBack : undefined

    if (dir && handler) {
      // fly off-screen, then change step — the new card animates in
      flying.current = true
      const w = cardRef.current?.offsetWidth ?? 400
      setCard(
        `translateX(${dir === 'left' ? -w : w}px) rotate(${dir === 'left' ? -6 : 6}deg)`,
        '0',
        `transform ${FLY_MS}ms ease-in, opacity ${FLY_MS}ms ease-in`,
      )
      window.setTimeout(() => {
        setCard('', '')
        flying.current = false
        handler()
      }, FLY_MS)
    } else {
      setCard('', '', SNAP_BACK)
    }
  }

  function handlePointerCancel(e: React.PointerEvent) {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    drag.current = null
    if (d.axis === 'h') setCard('', '', SNAP_BACK)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
        }}
      >
        {step > 1 ? (
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <ArrowLeft size={22} color="var(--text-secondary)" />
          </button>
        ) : (
          <div style={{ width: 30 }} />
        )}

        {/* Step dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              style={{
                height: 8,
                width: i + 1 === step ? 24 : 8,
                borderRadius: 999,
                background: i + 1 === step ? 'var(--accent)' : 'var(--border)',
                transition: 'width 200ms ease-out, background 200ms ease-out',
              }}
            />
          ))}
        </div>

        <div style={{ width: 30 }} />
      </div>

      {/* Step content — scrolls if it doesn't fit, centered otherwise.
          touch-action: pan-y leaves vertical scrolling to the browser while
          horizontal drags drive the card. */}
      <div
        className="scroll-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 16px',
          touchAction: 'pan-y',
        }}
      >
        {/* Drag layer — follows the finger; separate from the keyed div so
            the entrance animation and the drag transform never conflict */}
        <div
          ref={cardRef}
          style={{
            flex: '1 0 auto',
            display: 'flex',
            flexDirection: 'column',
            willChange: 'transform',
          }}
        >
          <div
            key={step}
            className={animDir === 'forward' ? 'anim-in-r' : 'anim-in-l'}
            style={{
              margin: 'auto 0',
              padding: '8px 0 32px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
