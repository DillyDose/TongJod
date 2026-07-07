import { useState } from 'react'
import { t } from '@/lib/i18n'
import { todayISO, yesterdayISO } from '@/lib/dates'
import type { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  initialNote?: string
  initialDate?: string
  onNext: (note: string, date: string) => void
  /** Mirrors the values to the parent as the user types/picks */
  onChange?: (note: string, date: string) => void
}

export function StepDetails({ lang, initialNote = '', initialDate, onNext, onChange }: Props) {
  // Local-timezone dates — toISOString() is UTC and would shift the date
  // before 7am in Thailand
  const today = todayISO()
  const yesterday = yesterdayISO()
  const [note, setNote] = useState(initialNote)
  const [date, setDate] = useState(initialDate ?? today)

  function update(nextNote: string, nextDate: string) {
    setNote(nextNote)
    setDate(nextDate)
    onChange?.(nextNote, nextDate)
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
        {t('detailsTitle', lang)}
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
        {t('detailsHint', lang)}
      </p>

      <input
        type="text"
        value={note}
        onChange={(e) => update(e.target.value, date)}
        placeholder={t('notePlaceholder', lang)}
        className="tj-input"
        style={{
          marginBottom: 20,
          fontSize: 16,
          minHeight: 56,
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onNext(note, date)
        }}
      />

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
          value={date}
          max={today}
          onChange={(e) => update(note, e.target.value)}
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
          onClick={() => update(note, today)}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            background: date === today ? 'var(--accent)' : '#F7F7F7',
            color: date === today ? 'white' : 'var(--text-primary)',
            border: date === today ? 'none' : '1.5px solid var(--border)',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font-thai)',
            cursor: 'pointer',
          }}
        >
          {t('today', lang)}
        </button>
        <button
          onClick={() => update(note, yesterday)}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            background: date === yesterday ? 'var(--accent)' : '#F7F7F7',
            color: date === yesterday ? 'white' : 'var(--text-primary)',
            border: date === yesterday ? 'none' : '1.5px solid var(--border)',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font-thai)',
            cursor: 'pointer',
          }}
        >
          {t('yesterday', lang)}
        </button>
      </div>

      {/* Note is optional and date always has a value, so never disabled */}
      <button
        className="tj-btn-primary"
        style={{ width: '100%' }}
        onClick={() => onNext(note, date)}
      >
        {t('continue', lang)} →
      </button>
    </div>
  )
}
