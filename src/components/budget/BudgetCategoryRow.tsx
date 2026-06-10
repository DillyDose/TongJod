import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { Lang, Category, Budget } from '@/lib/types'

interface Props {
  category: Category
  budget?: Budget
  lang: Lang
  onBudgetChange: (catId: string, amount: number) => void
  onDelete: (catId: string) => void
  showAmount: boolean
  icon?: string  // Material Symbols icon name
}

export function BudgetCategoryRow({
  category,
  budget,
  lang,
  onBudgetChange,
  onDelete,
  showAmount,
  icon,
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
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            placeholder="0"
            style={{
              width: 80,
              textAlign: 'right',
              border: 'none',
              background: 'transparent',
              fontFamily: 'var(--font-display)',
              fontSize: 14,
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
  )
}
