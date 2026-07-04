import { TrendingUp, TrendingDown } from 'lucide-react'
import { t } from '@/lib/i18n'
import { fmt } from '@/lib/theme'
import type { Lang, Transaction } from '@/lib/types'

interface Props {
  transactions: Transaction[]
  daysInMonth: number
  lang: Lang
}

export function SummaryCards({ transactions, daysInMonth, lang }: Props) {
  const totalIncome  = transactions.filter((x) => x.type === 'income').reduce((s, x) => s + x.amount, 0)
  const totalExpense = transactions.filter((x) => x.type === 'expense').reduce((s, x) => s + x.amount, 0)
  const avgIncome    = daysInMonth > 0 ? Math.round(totalIncome  / daysInMonth) : 0
  const avgExpense   = daysInMonth > 0 ? Math.round(totalExpense / daysInMonth) : 0

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {/* Income card */}
      <div
        className="tj-card anim-card"
        style={{ borderLeft: '4px solid #22C55E', paddingLeft: 12, animationDelay: '60ms' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <TrendingUp size={16} color="#059669" />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-thai)' }}>
            {t('income', lang)}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>
          {fmt(totalIncome)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t('baht', lang)}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-thai)' }}>
          {t('avgPerDay', lang, { n: fmt(avgIncome) })}
        </div>
      </div>

      {/* Expense card */}
      <div
        className="tj-card anim-card"
        style={{ borderLeft: '4px solid #EF4444', paddingLeft: 12, animationDelay: '120ms' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <TrendingDown size={16} color="#DC2626" />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-thai)' }}>
            {t('expense', lang)}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>
          {fmt(totalExpense)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t('baht', lang)}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-thai)' }}>
          {t('avgPerDay', lang, { n: fmt(avgExpense) })}
        </div>
      </div>
    </div>
  )
}
