'use client'
import { useEffect } from 'react'

interface Props {
  message: string
  actionLabel?: string
  onAction?: () => void
  onClose: () => void
  duration?: number
}

export function Snackbar({ message, actionLabel, onAction, onClose, duration = 5000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="anim-card"
      style={{
        position: 'fixed',
        bottom: 96,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        width: 'calc(100% - 48px)',
        maxWidth: 432,
        background: '#1e1b19',
        color: '#fff',
        borderRadius: 14,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      }}
    >
      <span style={{ fontFamily: 'var(--font-thai)', fontSize: 14 }}>{message}</span>
      {actionLabel && onAction && (
        <button
          onClick={() => { onAction(); onClose() }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--accent-light, #89E219)',
            fontFamily: 'var(--font-thai)',
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
            padding: 4,
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
