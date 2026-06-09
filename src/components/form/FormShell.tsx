'use client'
import { ArrowLeft } from 'lucide-react'

interface Props {
  step: number
  totalSteps: number
  onBack: () => void
  children: React.ReactNode
  animDir: 'forward' | 'back'
}

export function FormShell({ step, totalSteps, onBack, children, animDir }: Props) {
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

      {/* Animated step content */}
      <div
        key={step}
        className={animDir === 'forward' ? 'anim-in-r' : 'anim-in-l'}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 16px 32px',
        }}
      >
        {children}
      </div>
    </div>
  )
}
