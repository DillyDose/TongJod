'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { getSupabase } from '@/lib/supabase/client'
import { AppShell } from '@/components/AppShell'
import { BottomNav } from '@/components/BottomNav'
import { BudgetCategoryRow } from '@/components/budget/BudgetCategoryRow'
import { AddCategorySheet } from '@/components/budget/AddCategorySheet'
import { useCategories } from '@/hooks/useCategories'
import { useBudgets } from '@/hooks/useBudgets'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'
import { fmt } from '@/lib/theme'

export default function BudgetPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [lang] = useLang()
  const [sheet, setSheet] = useState<'income' | 'expense' | null>(null)

  const { categories, addCategory, deleteCategory } = useCategories(userId)
  const { budgets, setBudget, totalBudget } = useBudgets(userId)

  useEffect(() => {
    void (async () => {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) { router.push('/'); return }
      setUserId(user.id)
    })()
  }, [router])

  const expenseCategories = categories.filter((c) => c.type === 'expense')
  const incomeCategories  = categories.filter((c) => c.type === 'income')

  return (
    <AppShell>
      {/* Header */}
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {t('budgetTitle', lang)}
        </h2>
      </div>

      <div
        className="scroll-hidden"
        style={{ flex: 1, padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {/* Expense budgets */}
        <div className="tj-card">
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: 'var(--text-secondary)',
              marginBottom: 4,
              fontFamily: 'var(--font-thai)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('expense', lang)}
          </div>

          {expenseCategories.map((cat) => (
            <BudgetCategoryRow
              key={cat.id}
              category={cat}
              budget={budgets.find((b) => b.category_id === cat.id)}
              lang={lang}
              onBudgetChange={setBudget}
              onDelete={deleteCategory}
              showAmount
            />
          ))}

          {/* Total row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 14,
              fontWeight: 700,
            }}
          >
            <span style={{ fontFamily: 'var(--font-thai)' }}>{t('totalBudget', lang)}</span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--accent)',
                fontSize: 18,
              }}
            >
              ฿{fmt(totalBudget)}
            </span>
          </div>

          <button
            onClick={() => setSheet('expense')}
            className="tj-btn-ghost"
            style={{
              width: '100%',
              marginTop: 12,
              borderStyle: 'dashed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Plus size={16} /> {t('addCategory', lang)}
          </button>
        </div>

        {/* Income categories (name only, no budget) */}
        <div className="tj-card">
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: 'var(--text-secondary)',
              marginBottom: 4,
              fontFamily: 'var(--font-thai)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('income', lang)}
          </div>

          {incomeCategories.map((cat) => (
            <BudgetCategoryRow
              key={cat.id}
              category={cat}
              lang={lang}
              onBudgetChange={() => {}}
              onDelete={deleteCategory}
              showAmount={false}
            />
          ))}

          <button
            onClick={() => setSheet('income')}
            className="tj-btn-ghost"
            style={{
              width: '100%',
              marginTop: 12,
              borderStyle: 'dashed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Plus size={16} /> {t('addCategory', lang)}
          </button>
        </div>
      </div>

      {sheet && (
        <AddCategorySheet
          lang={lang}
          type={sheet}
          onAdd={(name) => addCategory(name, sheet)}
          onClose={() => setSheet(null)}
        />
      )}

      <BottomNav lang={lang} />
    </AppShell>
  )
}
