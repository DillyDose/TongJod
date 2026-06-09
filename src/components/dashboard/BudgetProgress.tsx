'use client'
import { useTheme } from '@/components/ThemeProvider'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

const STATUS_LABEL: Record<string, string> = {
  excellent: '🌿 ยอดเยี่ยม',
  onTrack:   '✓ อยู่ในงบ',
  over:      '⚠ เกินงบ',
  default:   '—',
}

interface Props {
  expectedPct: number
  actualPct: number
  lang: Lang
}

export function BudgetProgress({ expectedPct, actualPct, lang }: Props) {
  const { theme, statusKey, statusMessage } = useTheme()

  return (
    <div
      className="tj-card anim-card"
      style={{ background: `color-mix(in srgb, var(--surface) 85%, ${theme.pillBg})` }}
    >
      {/* Status pill */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <span
          style={{
            background: theme.pillBg,
            color: theme.pillText,
            borderRadius: 'var(--r-full)',
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'var(--font-thai)',
          }}
        >
          {STATUS_LABEL[statusKey]}
        </span>
      </div>

      {/* Status message */}
      <p
        style={{
          textAlign: 'center',
          marginBottom: 16,
          fontFamily: 'var(--font-thai)',
          fontSize: 15,
          color: 'var(--text-primary)',
        }}
      >
        {statusMessage}
      </p>

      {/* Label row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
          fontSize: 12,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-thai)',
        }}
      >
        <span>{t('expected', lang, { n: expectedPct })}</span>
        <span>{t('actual', lang, { n: actualPct })}</span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'relative',
          height: 12,
          borderRadius: 'var(--r-full)',
          background: 'var(--surface-secondary)',
          overflow: 'hidden',
        }}
      >
        {/* Actual fill */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${Math.min(actualPct, 100)}%`,
            background: `linear-gradient(90deg, ${theme.accentLight}, ${theme.bar})`,
            borderRadius: 'var(--r-full)',
            transition: 'width 600ms ease-out',
          }}
        />
        {/* Expected marker */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${Math.min(expectedPct, 100)}%`,
            width: 2,
            background: '#fff',
            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
            transform: 'translateX(-50%)',
          }}
        />
      </div>
    </div>
  )
}
