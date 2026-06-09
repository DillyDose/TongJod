import { useState } from 'react'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  initial?: string
  onNext: (note: string) => void
  onSkip: () => void
}

export function StepNote({ lang, initial = '', onNext, onSkip }: Props) {
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
        {t('formNote', lang)}
      </h1>

      <input
        type="text"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('notePlaceholder', lang)}
        className="tj-input"
        style={{ marginBottom: 16 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') value ? onNext(value) : onSkip()
        }}
      />

      <button
        className="tj-btn-primary"
        style={{ width: '100%', marginBottom: 12 }}
        onClick={() => onNext(value)}
        disabled={!value}
      >
        {t('continue', lang)}
      </button>

      <button className="tj-btn-ghost" style={{ width: '100%' }} onClick={onSkip}>
        {t('skip', lang)} →
      </button>
    </div>
  )
}
