import { t } from '@/lib/i18n'
import type { Lang, Category } from '@/lib/types'

interface Props {
  lang: Lang
  categories: Category[]
  type: 'income' | 'expense'
  initial?: string
  onNext: (catId: string) => void
}

export function StepCategory({ lang, categories, type, initial, onNext }: Props) {
  const filtered = categories
    .filter((c) => c.type === type)
    .sort((a, b) => b.usage_count - a.usage_count)

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
        {t('formCategory', lang)}
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {filtered.map((cat) => {
          const selected = cat.id === initial
          return (
            <button
              key={cat.id}
              onClick={() => onNext(cat.id)}
              style={{
                background: selected ? 'var(--accent)' : 'var(--surface-secondary)',
                color: selected ? '#fff' : 'var(--text-primary)',
                border: '1.5px solid transparent',
                borderRadius: 'var(--r-xl)',
                padding: '10px 16px',
                cursor: 'pointer',
                fontFamily: 'var(--font-thai)',
                fontSize: 14,
                fontWeight: 500,
                transition: 'transform 180ms ease-out, background 150ms',
                transform: selected ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              {cat.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
