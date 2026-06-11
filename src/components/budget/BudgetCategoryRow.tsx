import { useState, useEffect, useRef } from 'react'
import { Trash2 } from 'lucide-react'
import { fmt } from '@/lib/theme'
import { t } from '@/lib/i18n'
import type { Lang, Category, Budget } from '@/lib/types'

interface Props {
  category: Category
  budget?: Budget
  spent?: number
  lang: Lang
  onBudgetChange: (catId: string, amount: number) => void
  onDelete: (catId: string) => void
  showAmount: boolean
  icon?: string  // Material Symbols icon name
}

export function BudgetCategoryRow({
  category,
  budget,
  spent = 0,
  lang,
  onBudgetChange,
  onDelete,
  showAmount,
  icon,
}: Props) {
  const budgetStr = budget ? String(budget.amount) : ''
  const [value, setValue] = useState(budgetStr)
  const focusedRef = useRef(false)

  // Budgets load async after categories — sync the input once they arrive,
  // but never while the user is typing
  useEffect(() => {
    if (!focusedRef.current) setValue(budgetStr)
  }, [budgetStr])

  function handleBlur() {
    focusedRef.current = false
    if (value === budgetStr) return // unchanged — don't write
    if (value.trim() === '' && !budget) return // empty and nothing set — no-op
    const n = Number(value || 0)
    if (!isNaN(n) && n >= 0) onBudgetChange(category.id, n)
  }

  const budgetAmount = budget?.amount ?? 0
  const usedPct = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0
  const barColor = usedPct > 100 ? '#FF4B4B' : usedPct >= 80 ? '#FF9600' : '#58CC02'

  return (
    <div
      style={{
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Icon circle */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9999,
            background: 'var(--surface-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18, color: 'var(--text-secondary)', userSelect: 'none' }}
          >
            {icon ?? 'category'}
          </span>
        </div>

        <span style={{ flex: 1, fontFamily: 'var(--font-thai)', fontSize: 15 }}>
          {category.name}
        </span>

        {showAmount && (
          <div
            style={{
              background: '#F7F7F7',
              borderRadius: 12,
              border: '1.5px solid var(--border)',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => { focusedRef.current = true }}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
              placeholder={t('notSet', lang)}
              style={{
                width: 80,
                textAlign: 'right',
                border: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-display)',
                // 16px minimum — smaller inputs make iOS Safari zoom the
                // page on focus, leaving it at a different scale
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>
        )}

        <button
          onClick={() => onDelete(category.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          aria-label="delete"
        >
          <Trash2 size={16} color="var(--text-muted)" />
        </button>
      </div>

      {/* Spent-vs-budget progress */}
      {showAmount && budgetAmount > 0 && (
        <div style={{ marginTop: 8, paddingLeft: 48 }}>
          <div
            style={{
              height: 5,
              borderRadius: 999,
              background: 'var(--surface-secondary)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 999,
                width: `${Math.min(usedPct, 100)}%`,
                background: barColor,
                transition: 'width 400ms ease-out',
              }}
            />
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              color: usedPct > 100 ? '#DC2626' : 'var(--text-muted)',
              fontFamily: 'var(--font-thai)',
            }}
          >
            {t('spent', lang)} ฿{fmt(spent)} / ฿{fmt(budgetAmount)}
          </div>
        </div>
      )}
    </div>
  )
}
