import type { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  onSelect: (type: 'income' | 'expense') => void
}

export function StepType({ lang, onSelect }: Props) {
  return (
    <div>
      {/* Heading section */}
      <h1
        style={{
          fontFamily: 'var(--font-thai)',
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        เลือกประเภท
      </h1>
      <p
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        รายรับหรือรายจ่าย?
      </p>

      {/* Income and Expense cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Income Card */}
        <button
          onClick={() => onSelect('income')}
          style={{
            width: '100%',
            borderRadius: 20,
            padding: '24px 20px',
            cursor: 'pointer',
            transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: 'rgba(34, 197, 94, 0.08)',
            border: '2px solid #22C55E',
            boxShadow: '0 4px 0 0 #16A34A',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(2px)'
            e.currentTarget.style.boxShadow = '0 2px 0 0 #16A34A'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '0 4px 0 0 #16A34A'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '0 4px 0 0 #16A34A'
          }}
        >
          {/* Icon circle */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 9999,
              background: '#22C55E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: 'white',
              flexShrink: 0,
            }}
          >
            ↓
          </div>
          {/* Label */}
          <span
            style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 20,
              fontWeight: 700,
              color: '#15803D',
            }}
          >
            รายรับ
          </span>
        </button>

        {/* Expense Card */}
        <button
          onClick={() => onSelect('expense')}
          style={{
            width: '100%',
            borderRadius: 20,
            padding: '24px 20px',
            cursor: 'pointer',
            transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: 'rgba(239, 68, 68, 0.08)',
            border: '2px solid #EF4444',
            boxShadow: '0 4px 0 0 #DC2626',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(2px)'
            e.currentTarget.style.boxShadow = '0 2px 0 0 #DC2626'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '0 4px 0 0 #DC2626'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '0 4px 0 0 #DC2626'
          }}
        >
          {/* Icon circle */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 9999,
              background: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: 'white',
              flexShrink: 0,
            }}
          >
            ↑
          </div>
          {/* Label */}
          <span
            style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 20,
              fontWeight: 700,
              color: '#DC2626',
            }}
          >
            รายจ่าย
          </span>
        </button>
      </div>
    </div>
  )
}
