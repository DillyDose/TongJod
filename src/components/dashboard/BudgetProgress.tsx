'use client'
import { useTheme } from '@/components/ThemeProvider'
import { fmt } from '@/lib/theme'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

const STATUS_EMOJI: Record<string, string> = {
  excellent: '🎉',
  onTrack:   '👍',
  over:      '😬',
  default:   '💰',
}

// Status labels stay Thai — they are the personality of the app
const STATUS_LABEL: Record<string, string> = {
  excellent: 'ยอดเยี่ยม!',
  onTrack:   'อยู่ในงบ!',
  over:      'เกินงบแล้ว!',
  default:   'ยังไม่มีงบ',
}

interface Props {
  expectedPct: number
  actualPct: number
  lang: Lang
  totalBudget: number
  totalExpense: number
}

export function BudgetProgress({ expectedPct, actualPct, lang, totalBudget, totalExpense }: Props) {
  const { theme, statusKey, statusMessage } = useTheme()

  const remainingAmount = totalBudget - totalExpense
  const hasNoBudget = totalBudget === 0
  const isOver = !hasNoBudget && remainingAmount < 0

  const emoji = STATUS_EMOJI[statusKey] ?? '💰'
  const label = STATUS_LABEL[statusKey] ?? ''

  const pillText = hasNoBudget
    ? t('noBudgetSet', lang)
    : isOver
      ? t('overBy', lang, { n: fmt(-remainingAmount) })
      : `฿${fmt(remainingAmount)}`

  return (
    <div
      style={{
        background: theme.accent,
        borderRadius: 20,
        boxShadow: `0 4px 0 0 ${theme.shadow}`,
        padding: 16,
      }}
    >
      {/* Row 1 — Status emoji + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <span
          style={{
            fontFamily: 'var(--font-thai)',
            fontSize: 18,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          {label}
        </span>
      </div>

      {/* Row 2 — Status message */}
      <p
        style={{
          margin: '0 0 16px 0',
          fontFamily: 'var(--font-thai)',
          fontSize: 14,
          color: 'rgba(255,255,255,0.9)',
        }}
      >
        {statusMessage}
      </p>

      {/* Row 3 — Percentage + Remaining */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 12,
        }}
      >
        {/* Left: budget used + big % */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.8)',
              marginBottom: 2,
            }}
          >
            {t('usedBudget', lang)}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 40,
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1,
              }}
            >
              {actualPct}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                color: '#fff',
                lineHeight: 1,
              }}
            >
              %
            </span>
          </div>
        </div>

        {/* Right: remaining pill */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div
            style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            {t('leftToSpend', lang)}
          </div>
          <div
            style={{
              background: '#fff',
              color: theme.accent,
              borderRadius: 9999,
              padding: '6px 14px',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'var(--font-thai)',
              whiteSpace: 'nowrap',
            }}
          >
            {pillText}
          </div>
        </div>
      </div>

      {/* Row 4 — Progress bar with expected-pace marker */}
      <div
        style={{
          position: 'relative',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 9999,
          height: 12,
        }}
      >
        <div
          style={{
            background: '#fff',
            height: '100%',
            borderRadius: 9999,
            width: `${Math.min(actualPct, 100)}%`,
            transition: 'width 600ms ease-out',
          }}
        />
        {!hasNoBudget && expectedPct > 0 && expectedPct < 100 && (
          <div
            style={{
              position: 'absolute',
              top: -3,
              bottom: -3,
              left: `${expectedPct}%`,
              width: 3,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.95)',
              boxShadow: '0 0 0 1.5px rgba(0,0,0,0.25)',
            }}
          />
        )}
      </div>

      {/* Row 5 — expected pace caption */}
      {!hasNoBudget && (
        <div
          style={{
            marginTop: 8,
            fontFamily: 'var(--font-thai)',
            fontSize: 11,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'right',
          }}
        >
          {t('expected', lang, { n: expectedPct })}
        </div>
      )}
    </div>
  )
}
