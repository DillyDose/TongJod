import { useState } from 'react'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  initial?: string
  onNext: (amount: string) => void
}

export function StepAmount({ lang, initial = '', onNext }: Props) {
  const [value, setValue] = useState(initial)

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
        {t('formAmount', lang)}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <input
          type="number"
          inputMode="decimal"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0"
          className="tj-input"
          style={{
            fontSize: 28,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            textAlign: 'right',
            flex: 1,
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value && Number(value) > 0) onNext(value)
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-thai)',
            color: 'var(--text-secondary)',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {t('baht', lang)}
        </span>
      </div>

      <button
        className="tj-btn-primary"
        style={{ width: '100%' }}
        disabled={!value || Number(value) <= 0}
        onClick={() => onNext(value)}
      >
        {t('continue', lang)}
      </button>
    </div>
  )
}
