'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '@/components/ThemeProvider'
import { t } from '@/lib/i18n'
import type { Lang, Transaction } from '@/lib/types'

interface Props {
  transactions: Transaction[]
  daysInMonth: number
  lang: Lang
}

export function DailyChart({ transactions, daysInMonth, lang }: Props) {
  const { theme } = useTheme()

  const data = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1
    const pad = String(dayNum).padStart(2, '0')
    const total = transactions
      .filter((tx) => tx.type === 'expense' && tx.date.endsWith(`-${pad}`))
      .reduce((s, tx) => s + tx.amount, 0)
    return { day: dayNum, amount: total }
  })

  return (
    <div className="tj-card anim-card">
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 15,
          marginBottom: 16,
        }}
      >
        {t('dailyExpense', lang)}
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barSize={6} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
            formatter={(v: number) => [`฿${v.toLocaleString()}`, '']}
            labelFormatter={(l) => `Day ${l}`}
          />
          <Bar dataKey="amount" fill={theme.bar} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
