import { fmt } from '@/lib/theme'
import { t } from '@/lib/i18n'
import { fmtDate } from '@/lib/dates'
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
  error: boolean
}

function ConfirmRow({ label, children, borderBottom }: { label: string; children: React.ReactNode; borderBottom?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: borderBottom ? '1px solid var(--border)' : 'none' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-thai)' }}>{label}</span>
      {children}
    </div>
  )
}

export function StepConfirm({ lang, draft, categories, error }: Props) {
  const cat = categories.find((c) => c.id === draft.categoryId)
  const typeColor = draft.type === 'income' ? '#22C55E' : '#EF4444'
  const typeLabel = draft.type === 'income' ? t('income', lang) : t('expense', lang)

  return (
    <div>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        {t('confirmTitle', lang)}
      </h2>

      <div className="tj-card" style={{ marginBottom: 24 }}>
        <ConfirmRow label={t('fType', lang)} borderBottom>
          <span style={{ fontWeight: 700, fontSize: 14, color: typeColor, fontFamily: 'var(--font-thai)' }}>
            {typeLabel}
          </span>
        </ConfirmRow>

        <ConfirmRow label={t('fAmount', lang)} borderBottom>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
            ฿{fmt(Number(draft.amount))}
          </span>
        </ConfirmRow>

        <ConfirmRow label={t('fCategory', lang)} borderBottom>
          <span style={{ fontWeight: 500, fontSize: 14, fontFamily: 'var(--font-thai)' }}>
            {cat?.name ?? '—'}
          </span>
        </ConfirmRow>

        <ConfirmRow label={t('fNote', lang)} borderBottom>
          <span style={{ fontWeight: 400, fontSize: 14, color: draft.note ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-thai)' }}>
            {draft.note || '—'}
          </span>
        </ConfirmRow>

        <ConfirmRow label={t('fDate', lang)}>
          <span style={{ fontWeight: 500, fontSize: 14, fontFamily: 'var(--font-thai)' }}>
            {fmtDate(draft.date, lang)}
          </span>
        </ConfirmRow>
      </div>

      {error && (
        <p
          style={{
            color: '#DC2626',
            fontSize: 13,
            fontWeight: 600,
            textAlign: 'center',
            fontFamily: 'var(--font-thai)',
            marginBottom: 12,
          }}
        >
          {t('saveFailed', lang)}
        </p>
      )}
    </div>
  )
}
