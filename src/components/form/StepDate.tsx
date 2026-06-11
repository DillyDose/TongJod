import { useState } from 'react'
import { t } from '@/lib/i18n'
import { todayISO, yesterdayISO } from '@/lib/dates'
import type { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  initial?: string
  onNext: (date: string) => void
  /** Mirrors the value to the parent as the user picks (for swipe-forward) */
  onChange?: (date: string) => void
}

export function StepDate({ lang, initial, onNext, onChange }: Props) {
  // Local-timezone dates — toISOString() is UTC and would shift the date
  // before 7am in Thailand
  const today = todayISO()
  const yesterday = yesterdayISO()
  const [value, setValue] = useState(initial ?? today)

  function update(v: string) {
    setValue(v)
    onChange?.(v)
  }

  return (
    <div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {t('chooseDate', lang)}
      </h1>

      <p
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: 28,
          fontFamily: 'var(--font-thai)',
        }}
      >
        {t('dateHint', lang)}
      </p>

      <div
        style={{
          background: '#F7F7F7',
          border: '2px solid var(--accent)',
          borderRadius: 16,
          padding: '16px 20px',
          marginBottom: 20,
        }}
      >
        <input
          type="date"
          value={value}
          max={today}
          onChange={(e) => update(e.target.value)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 18,
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => update(today)}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            background: value === today ? 'var(--accent)' : '#F7F7F7',
            color: value === today ? 'white' : 'var(--text-primary)',
            border: value === today ? 'none' : '1.5px solid var(--border)',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font-thai)',
            cursor: 'pointer',
          }}
        >
          {t('today', lang)}
        </button>
        <button
          onClick={() => update(yesterday)}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            background: value === yesterday ? 'var(--accent)' : '#F7F7F7',
            color: value === yesterday ? 'white' : 'var(--text-primary)',
            border: value === yesterday ? 'none' : '1.5px solid var(--border)',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font-thai)',
            cursor: 'pointer',
          }}
        >
          {t('yesterday', lang)}
        </button>
      </div>

      <button
        className="tj-btn-primary"
        style={{ width: '100%' }}
        onClick={() => onNext(value)}
        disabled={!value}
      >
        {t('continue', lang)} →
      </button>
    </div>
  )
}
