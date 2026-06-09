'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Globe } from 'lucide-react'
import { getSupabase } from '@/lib/supabase/client'
import { AppShell } from '@/components/AppShell'
import { BottomNav } from '@/components/BottomNav'
import { BudgetProgress } from '@/components/dashboard/BudgetProgress'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { DailyChart } from '@/components/dashboard/DailyChart'
import { TopCategories } from '@/components/dashboard/TopCategories'
import { useTheme } from '@/components/ThemeProvider'
import { useTransactions } from '@/hooks/useTransactions'
import { useBudgets } from '@/hooks/useBudgets'
import { useCategories } from '@/hooks/useCategories'
import { useLang } from '@/hooks/useLang'

const MONTH_TH = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
]
const MONTH_EN = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export default function DashboardPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [lang, setLang] = useLang()
  const { setSpendingData } = useTheme()

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

  const { transactions, loading } = useTransactions(userId, year, month)
  const { budgets, totalBudget }  = useBudgets(userId)
  const { categories }            = useCategories(userId)

  const totalExpense = transactions
    .filter((x) => x.type === 'expense')
    .reduce((s, x) => s + x.amount, 0)

  useEffect(() => {
    setSpendingData(totalExpense, totalBudget)
  }, [totalExpense, totalBudget, setSpendingData])

  const daysInMonth  = new Date(year, month, 0).getDate()
  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth() + 1
  const daysElapsed  = isCurrentMonth ? now.getDate() : daysInMonth
  const expectedPct  = Math.round((daysElapsed / daysInMonth) * 100)
  const actualPct    = totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100) : 0

  const monthLabel =
    lang === 'th'
      ? `${MONTH_TH[month - 1]} ${year + 543}`
      : `${MONTH_EN[month - 1]} ${year}`

  if (!userId || loading) {
    return (
      <AppShell>
        <div style={{ flex: 1 }} />
      </AppShell>
    )
  }

  return (
    <AppShell>
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
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-thai)',
            fontWeight: 600,
            fontSize: 15,
            color: 'var(--text-primary)',
          }}
        >
          {monthLabel} <ChevronDown size={16} />
        </button>

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

      {/* Scrollable content */}
      <div
        className="scroll-hidden"
        style={{
          flex: 1,
          padding: '8px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <BudgetProgress expectedPct={expectedPct} actualPct={actualPct} lang={lang} />
        <SummaryCards transactions={transactions} daysElapsed={daysElapsed} lang={lang} />
        <DailyChart transactions={transactions} daysInMonth={daysInMonth} lang={lang} />
        <TopCategories transactions={transactions} categories={categories} lang={lang} />
      </div>

      <BottomNav lang={lang} />
    </AppShell>
  )
}
