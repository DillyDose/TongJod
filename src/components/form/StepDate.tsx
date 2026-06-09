import { useState } from 'react'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  initial?: string
  onNext: (date: string) => void
}

export function StepDate({ lang, initial, onNext }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [value, setValue] = useState(initial ?? today)

  return (
    <div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 24,
          marginBottom: 32,
          textAlign: 'center',
        }}
      >
        {t('formDate', lang)}
      </h1>

      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="tj-input"
        style={{ marginBottom: 12 }}
      />

      <button
        className="tj-btn-ghost"
        style={{ width: '100%', marginBottom: 20 }}
        onClick={() => setValue(today)}
      >
        {t('today', lang)}
      </button>

      <button
        className="tj-btn-primary"
        style={{ width: '100%' }}
        onClick={() => onNext(value)}
        disabled={!value}
      >
        {t('continue', lang)}
      </button>
    </div>
  )
}
