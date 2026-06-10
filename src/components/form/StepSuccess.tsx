'use client'
import { useTheme } from '@/components/ThemeProvider'
import { fmt } from '@/lib/theme'
import type { Category } from '@/lib/types'

interface Props {
  amount: string
  type: 'income' | 'expense'
  categoryId: string
  categories: Category[]
  onHome: () => void
}

export function StepSuccess({ amount, type, categoryId, categories, onHome }: Props) {
  const { theme } = useTheme()
  const cat = categories.find((c) => c.id === categoryId)
  const typeColor = type === 'income' ? '#22C55E' : '#EF4444'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: theme.gradient,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 24px',
        gap: 20,
      }}
      className="anim-fade"
    >
      {/* Checkmark icon card */}
      <div style={{
        width: 88, height: 88,
        borderRadius: 28,
        background: 'white',
        boxShadow: `0 8px 0 0 ${theme.shadow}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 44, color: theme.accent }}>✓</span>
      </div>

      {/* Heading + subtitle */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28, fontWeight: 800,
          color: 'white',
          marginBottom: 8,
        }}>
          บันทึกสำเร็จ! 🎉
        </h1>
        <p style={{
          fontFamily: 'var(--font-thai)',
          fontSize: 15,
          color: 'rgba(255,255,255,0.80)',
        }}>
          รายการของคุณถูกบันทึกเรียบร้อยแล้ว
        </p>
      </div>

      {/* Summary card */}
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '24px 24px',
        width: '100%',
        maxWidth: 360,
        boxShadow: `0 4px 0 0 ${theme.shadow}`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 12,
      }}>
        {/* Amount */}
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 36, fontWeight: 800,
          color: typeColor,
        }}>
          {type === 'income' ? '+' : '-'}฿{fmt(Number(amount))}
        </span>

        {/* Category chip */}
        {cat && (
          <span style={{
            fontFamily: 'var(--font-thai)',
            fontSize: 14, fontWeight: 600,
            background: type === 'income' ? '#DCFCE7' : '#FEE2E2',
            color: typeColor,
            borderRadius: 999,
            padding: '4px 16px',
          }}>
            {cat.name}
          </span>
        )}
      </div>

      {/* Home button */}
      <button
        onClick={onHome}
        style={{
          width: '100%', maxWidth: 360,
          height: 56, borderRadius: 16,
          background: 'white',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-thai)',
          fontSize: 16, fontWeight: 700,
          color: theme.accent,
          boxShadow: `0 4px 0 0 ${theme.shadow}`,
          transition: 'transform 120ms ease-out, box-shadow 120ms',
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(2px)'
          e.currentTarget.style.boxShadow = `0 2px 0 0 ${theme.shadow}`
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = `0 4px 0 0 ${theme.shadow}`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = `0 4px 0 0 ${theme.shadow}`
        }}
      >
        กลับไปหน้าหลัก
      </button>
    </div>
  )
}
