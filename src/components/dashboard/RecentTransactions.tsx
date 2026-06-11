'use client'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { t } from '@/lib/i18n'
import { fmt } from '@/lib/theme'
import { fmtDate } from '@/lib/dates'
import { categoryIcon } from '@/lib/icons'
import type { Lang, Transaction, Category } from '@/lib/types'

interface Props {
  transactions: Transaction[]
  categories: Category[]
  lang: Lang
  onDelete: (tx: Transaction) => void
}

export function RecentTransactions({ transactions, categories, lang, onDelete }: Props) {
  const router = useRouter()
  const catById = new Map(categories.map((c) => [c.id, c]))

  // Already ordered by created_at desc from the DB; group display stays simple
  return (
    <div className="tj-card anim-card">
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 15,
          marginBottom: 8,
        }}
      >
        {t('recent', lang)}
      </div>

      {transactions.length === 0 && (
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: 13,
            textAlign: 'center',
            fontFamily: 'var(--font-thai)',
            padding: '12px 0',
          }}
        >
          {t('noRecent', lang)}
        </p>
      )}

      {transactions.map((tx, i) => {
        const cat = catById.get(tx.category_id)
        const isIncome = tx.type === 'income'
        return (
          <div
            key={tx.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              borderBottom: i < transactions.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            {/* Tap target: opens the entry in the form for editing */}
            <button
              onClick={() => router.push(`/form?edit=${tx.id}`)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left',
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9999,
                  background: isIncome ? '#DCFCE7' : 'var(--surface-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18, color: isIncome ? '#15803D' : 'var(--text-secondary)' }}
                >
                  {categoryIcon(cat?.name ?? '')}
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-thai)',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat?.name ?? '—'}
                  {tx.note && (
                    <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>
                      {' '}· {tx.note}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                  {fmtDate(tx.date, lang)}
                </div>
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: isIncome ? '#16A34A' : '#DC2626',
                  flexShrink: 0,
                }}
              >
                {isIncome ? '+' : '-'}฿{fmt(tx.amount)}
              </span>
            </button>

            <button
              onClick={() => onDelete(tx)}
              aria-label="delete"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                flexShrink: 0,
              }}
            >
              <Trash2 size={15} color="var(--text-muted)" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
