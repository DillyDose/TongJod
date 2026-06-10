'use client'
import { useTheme } from '@/components/ThemeProvider'
import { fmt } from '@/lib/theme'
import type { Lang } from '@/lib/types'

const STATUS_EMOJI: Record<string, string> = {
  excellent: '🎉',
  onTrack:   '👍',
  over:      '😬',
  default:   '💰',
}

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

  const emoji = STATUS_EMOJI[statusKey] ?? '💰'
  const label = STATUS_LABEL[statusKey] ?? ''

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
        {/* Left: ใช้งบไปแล้ว + big % */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.8)',
              marginBottom: 2,
            }}
          >
            ใช้งบไปแล้ว
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

        {/* Right: เหลือใช้ + white pill */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div
            style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            เหลือใช้
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
            {hasNoBudget ? 'ไม่มีงบประมาณ' : `฿${fmt(remainingAmount)}`}
          </div>
        </div>
      </div>

      {/* Row 4 — Progress bar */}
      <div
        style={{
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 9999,
          height: 12,
          overflow: 'hidden',
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
      </div>
    </div>
  )
}
