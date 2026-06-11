'use client'
import { useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { detectSwipe } from '@/lib/gestures'

interface Props {
  step: number
  totalSteps: number
  onBack: () => void
  children: React.ReactNode
  animDir: 'forward' | 'back'
  /** Swipe left (next step). Omit to disable. */
  onSwipeForward?: () => void
  /** Swipe right (previous step). Omit to disable. */
  onSwipeBack?: () => void
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
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null)

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dir = detectSwipe(
      t.clientX - start.x,
      t.clientY - start.y,
      Date.now() - start.t,
    )
    if (dir === 'left') onSwipeForward?.()
    else if (dir === 'right') onSwipeBack?.()
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

      {/* Animated step content — scrolls if it doesn't fit, centered otherwise */}
      <div
        className="scroll-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 16px',
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
  )
}
