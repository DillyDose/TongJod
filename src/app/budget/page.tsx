'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Globe } from 'lucide-react'
import { getSupabase } from '@/lib/supabase/client'
import { AppShell } from '@/components/AppShell'
import { BottomNav } from '@/components/BottomNav'
import { Snackbar } from '@/components/Snackbar'
import { BudgetCategoryRow } from '@/components/budget/BudgetCategoryRow'
import { AddCategorySheet } from '@/components/budget/AddCategorySheet'
import { useCategories } from '@/hooks/useCategories'
import { useBudgets } from '@/hooks/useBudgets'
import { useTransactions } from '@/hooks/useTransactions'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'
import { fmt } from '@/lib/theme'
import { categoryIcon } from '@/lib/icons'
import { useTheme } from '@/components/ThemeProvider'
import type { Category } from '@/lib/types'

export default function BudgetPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [lang, setLang] = useLang()
  const [sheet, setSheet] = useState<'income' | 'expense' | null>(null)
  const [deletedCat, setDeletedCat] = useState<Category | null>(null)
  const { theme } = useTheme()

  const { categories, addCategory, deleteCategory, restoreCategory } = useCategories(userId)
  const { budgets, setBudget, totalBudget } = useBudgets(userId, categories)

  const now = new Date()
  const { transactions } = useTransactions(userId, now.getFullYear(), now.getMonth() + 1)

  useEffect(() => {
    void (async () => {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) { router.push('/'); return }
      setUserId(user.id)
    })()
  }, [router])

  const expenseCategories = categories.filter((c) => c.type === 'expense')
  const incomeCategories  = categories.filter((c) => c.type === 'income')

  // Spent per category for the current month (for the per-row progress bars)
  const spentByCategory = new Map<string, number>()
  for (const tx of transactions) {
    if (tx.type !== 'expense') continue
    spentByCategory.set(tx.category_id, (spentByCategory.get(tx.category_id) ?? 0) + tx.amount)
  }

  async function handleDeleteCategory(id: string) {
    const cat = categories.find((c) => c.id === id)
    await deleteCategory(id)
    if (cat) setDeletedCat(cat)
  }

  return (
    <AppShell nav={<BottomNav lang={lang} />}>
      {/* Header */}
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          {t('navBudget', lang)}
        </h2>

        <button
          onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-full)',
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Globe size={13} />
          {lang === 'th' ? 'TH · EN' : 'EN · TH'}
        </button>
      </div>

      {/* Total budget display */}
      <div style={{ padding: '0 16px 16px', textAlign: 'center' }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: theme.accent,
          }}
        >
          ฿{fmt(totalBudget)}
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-thai)',
            marginTop: 2,
          }}
        >
          {t('totalThisMonth', lang)}
        </div>
      </div>

      <div
        className="scroll-hidden"
        style={{ flex: 1, minHeight: 0, padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {/* Expense budgets */}
        <div className="tj-card">
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-thai)',
              marginBottom: 8,
            }}
          >
            {t('expense', lang)}
          </div>

          {expenseCategories.map((cat) => (
            <BudgetCategoryRow
              key={cat.id}
              category={cat}
              budget={budgets.find((b) => b.category_id === cat.id)}
              spent={spentByCategory.get(cat.id) ?? 0}
              lang={lang}
              onBudgetChange={setBudget}
              onDelete={handleDeleteCategory}
              showAmount
              icon={categoryIcon(cat.name)}
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
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-thai)',
              marginBottom: 8,
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
              onDelete={handleDeleteCategory}
              showAmount={false}
              icon={categoryIcon(cat.name)}
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

      {deletedCat && (
        <Snackbar
          // key restarts the 5s auto-close timer when a different category is deleted
          key={deletedCat.id}
          message={`${t('categoryDeleted', lang)} · ${deletedCat.name}`}
          actionLabel={t('undo', lang)}
          onAction={() => restoreCategory(deletedCat)}
          onClose={() => setDeletedCat(null)}
        />
      )}
    </AppShell>
  )
}
