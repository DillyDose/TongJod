'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Globe, LogOut } from 'lucide-react'
import { getSupabase } from '@/lib/supabase/client'
import { AppShell } from '@/components/AppShell'
import { BottomNav } from '@/components/BottomNav'
import { Snackbar } from '@/components/Snackbar'
import { BudgetProgress } from '@/components/dashboard/BudgetProgress'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { DailyChart } from '@/components/dashboard/DailyChart'
import { TopCategories } from '@/components/dashboard/TopCategories'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { useTheme } from '@/components/ThemeProvider'
import { useTransactions } from '@/hooks/useTransactions'
import { useBudgets } from '@/hooks/useBudgets'
import { useCategories } from '@/hooks/useCategories'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'
import { fmt } from '@/lib/theme'
import type { Transaction } from '@/lib/types'

const MONTH_TH = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
]
const MONTH_EN = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function Skeleton({ height }: { height: number }) {
  return (
    <div
      className="skeleton"
      style={{ height, borderRadius: 20, width: '100%' }}
    />
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [lang, setLang] = useLang()
  const { setSpendingData } = useTheme()
  const [deletedTx, setDeletedTx] = useState<Transaction | null>(null)

  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  useEffect(() => {
    void (async () => {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) { router.push('/'); return }
      setUserId(user.id)
    })()
  }, [router])

  const { transactions, loading, addTransaction, removeTransaction } =
    useTransactions(userId, year, month)
  const { categories }            = useCategories(userId)
  const { budgets, totalBudget }  = useBudgets(userId, categories)

  const totalIncome = transactions
    .filter((x) => x.type === 'income')
    .reduce((s, x) => s + x.amount, 0)
  const totalExpense = transactions
    .filter((x) => x.type === 'expense')
    .reduce((s, x) => s + x.amount, 0)
  const balance = totalIncome - totalExpense

  const daysInMonth  = new Date(year, month, 0).getDate()
  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth() + 1
  const daysElapsed  = isCurrentMonth ? now.getDate() : daysInMonth
  const expectedPct  = Math.round((daysElapsed / daysInMonth) * 100)
  const actualPct    = totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100) : 0

  useEffect(() => {
    if (loading) return
    setSpendingData(totalExpense, totalBudget, expectedPct)
  }, [totalExpense, totalBudget, expectedPct, loading, setSpendingData])

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  async function handleDeleteTx(tx: Transaction) {
    await removeTransaction(tx.id)
    setDeletedTx(tx)
  }
  async function undoDeleteTx() {
    if (!deletedTx) return
    const { id: _id, created_at: _ca, ...data } = deletedTx
    await addTransaction(data, { bumpUsage: false })
  }

  async function handleLogout() {
    await getSupabase().auth.signOut()
    router.replace('/')
  }

  const monthLabel =
    lang === 'th'
      ? `${MONTH_TH[month - 1]} ${year + 543}`
      : `${MONTH_EN[month - 1]} ${year}`

  const ready = userId && !loading

  return (
    <AppShell>
      {/* Scrollable content */}
      <div
        className="scroll-hidden"
        style={{
          flex: 1,
          minHeight: 0,
          padding: '8px 16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Month selector row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button
              onClick={prevMonth}
              aria-label="previous month"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 4, display: 'flex', alignItems: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <span
              style={{
                fontFamily: 'var(--font-thai)',
                fontWeight: 600,
                fontSize: 15,
                color: 'var(--text-primary)',
                minWidth: 120,
                textAlign: 'center',
              }}
            >
              {monthLabel}
            </span>
            <button
              onClick={nextMonth}
              disabled={isCurrentMonth}
              aria-label="next month"
              style={{
                background: 'none', border: 'none',
                cursor: isCurrentMonth ? 'default' : 'pointer',
                padding: 4, display: 'flex', alignItems: 'center',
                color: isCurrentMonth ? 'var(--border)' : 'var(--text-secondary)',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            <button
              onClick={handleLogout}
              aria-label={t('logout', lang)}
              title={t('logout', lang)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-full)',
                padding: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>

        {!ready ? (
          <>
            <Skeleton height={180} />
            <Skeleton height={56} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Skeleton height={110} />
              <Skeleton height={110} />
            </div>
            <Skeleton height={190} />
          </>
        ) : (
          <>
            <BudgetProgress
              expectedPct={expectedPct}
              actualPct={actualPct}
              lang={lang}
              totalBudget={totalBudget}
              totalExpense={totalExpense}
            />

            {/* Net balance card */}
            <div
              className="tj-card anim-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-thai)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                }}
              >
                {t('balance', lang)}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20,
                  fontWeight: 800,
                  color: balance >= 0 ? '#16A34A' : '#DC2626',
                }}
              >
                {balance < 0 ? '-' : ''}฿{fmt(Math.abs(balance))}
              </span>
            </div>

            <SummaryCards transactions={transactions} daysElapsed={daysElapsed} lang={lang} />
            <DailyChart transactions={transactions} daysInMonth={daysInMonth} lang={lang} />
            <TopCategories transactions={transactions} categories={categories} lang={lang} />
            <RecentTransactions
              transactions={transactions}
              categories={categories}
              lang={lang}
              onDelete={handleDeleteTx}
            />
          </>
        )}
      </div>

      {deletedTx && (
        <Snackbar
          message={t('entryDeleted', lang)}
          actionLabel={t('undo', lang)}
          onAction={undoDeleteTx}
          onClose={() => setDeletedTx(null)}
        />
      )}

      <BottomNav lang={lang} />
    </AppShell>
  )
}
