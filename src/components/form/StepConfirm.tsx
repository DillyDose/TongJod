import { t } from '@/lib/i18n'
import { fmt } from '@/lib/theme'
import type { Lang, Category } from '@/lib/types'

interface Draft {
  type: 'income' | 'expense'
  amount: string
  categoryId: string
  note: string
  date: string
}

interface Props {
  lang: Lang
  draft: Draft
  categories: Category[]
  onSave: () => void
  onEdit: () => void
}

export function StepConfirm({ lang, draft, categories, onSave, onEdit }: Props) {
  const cat = categories.find((c) => c.id === draft.categoryId)
  const rows = [
    { label: t('fType',     lang), value: t(draft.type, lang) },
    { label: t('fAmount',   lang), value: `฿${fmt(Number(draft.amount))}` },
    { label: t('fCategory', lang), value: cat?.name ?? '—' },
    { label: t('fNote',     lang), value: draft.note || t('noNote', lang) },
    { label: t('fDate',     lang), value: draft.date },
  ]

  return (
    <div>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 18,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        {t('formConfirm', lang)}
      </h2>

      <div className="tj-card" style={{ marginBottom: 24 }}>
        {rows.map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{label}</span>
            <span
              style={{ fontWeight: 500, fontSize: 14, fontFamily: 'var(--font-thai)' }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <button
        className="tj-btn-primary"
        style={{ width: '100%', marginBottom: 12 }}
        onClick={onSave}
      >
        {t('save', lang)}
      </button>

      <button className="tj-btn-ghost" style={{ width: '100%' }} onClick={onEdit}>
        {t('edit', lang)}
      </button>
    </div>
  )
}
