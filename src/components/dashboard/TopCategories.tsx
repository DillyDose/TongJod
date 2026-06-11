'use client'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import { t } from '@/lib/i18n'
import { fmt } from '@/lib/theme'
import type { Lang, Transaction, Category } from '@/lib/types'

interface Props {
  transactions: Transaction[]
  categories: Category[]
  lang: Lang
}

export function TopCategories({ transactions, categories, lang }: Props) {
  const router = useRouter()
  const { theme } = useTheme()
  const expenses = transactions.filter((tx) => tx.type === 'expense')

  const totals = categories
    .filter((c) => c.type === 'expense')
    .map((c) => ({
      name: c.name,
      total: expenses
        .filter((tx) => tx.category_id === c.id)
        .reduce((s, tx) => s + tx.amount, 0),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)

  const max = totals[0]?.total ?? 1

  return (
    <div className="tj-card anim-card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          {t('topCategories', lang)}
        </div>
        <button
          onClick={() => router.push('/budget')}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--accent)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-thai)',
          }}
        >
          {t('viewAll', lang)} →
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {totals.map(({ name, total }) => (
          <div key={name}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 4,
                fontSize: 13,
              }}
            >
              <span style={{ fontFamily: 'var(--font-thai)', color: 'var(--text-primary)' }}>
                {name}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>฿{fmt(total)}</span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'var(--surface-secondary)' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${theme.accentLight}, ${theme.bar})`,
                  width: `${(total / max) * 100}%`,
                  transition: 'width 600ms ease-out',
                }}
              />
            </div>
          </div>
        ))}

        {totals.length === 0 && (
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              textAlign: 'center',
              fontFamily: 'var(--font-thai)',
            }}
          >
            ยังไม่มีรายจ่ายเดือนนี้
          </p>
        )}
      </div>
    </div>
  )
}
