'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

interface Props {
  step: number
  totalSteps: number
  onBack: () => void
  children: React.ReactNode
  animDir: 'forward' | 'back'
}

/** Height of the on-screen keyboard overlapping the layout viewport.
 *  iOS overlays the keyboard without shrinking dvh, so the scroll container
 *  believes everything fits and buttons under the keyboard become
 *  unreachable — padding the scroller by this inset makes them scrollable. */
function useKeyboardInset(): number {
  const [inset, setInset] = useState(0)
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () =>
      setInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop))
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])
  return inset
}

export function FormShell({
  step,
  totalSteps,
  onBack,
  children,
  animDir,
}: Props) {
  const keyboardInset = useKeyboardInset()
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
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 16px',
          paddingBottom: keyboardInset,
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
