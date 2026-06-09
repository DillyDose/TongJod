import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { t } from '@/lib/i18n'
import type { Lang, Category, Budget } from '@/lib/types'

interface Props {
  category: Category
  budget?: Budget
  lang: Lang
  onBudgetChange: (catId: string, amount: number) => void
  onDelete: (catId: string) => void
  showAmount: boolean
}

export function BudgetCategoryRow({
  category,
  budget,
  lang,
  onBudgetChange,
  onDelete,
  showAmount,
}: Props) {
  const [value, setValue] = useState(budget ? String(budget.amount) : '')

  function handleBlur() {
    const n = Number(value)
    if (!isNaN(n) && n >= 0) onBudgetChange(category.id, n)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
        gap: 12,
      }}
    >
      <span style={{ flex: 1, fontFamily: 'var(--font-thai)', fontSize: 15 }}>
        {category.name}
      </span>

      {showAmount && (
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
          placeholder={t('notSet', lang)}
          style={{
            width: 100,
            textAlign: 'right',
            border: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
      )}

      <button
        onClick={() => onDelete(category.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        aria-label="delete"
      >
        <Trash2 size={16} color="var(--text-muted)" />
      </button>
    </div>
  )
}
