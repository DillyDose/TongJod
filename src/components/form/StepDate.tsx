import { useState } from 'react'

interface Props {
  initial?: string
  onNext: (date: string) => void
}

export function StepDate({ initial, onNext }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
  })()
  const [value, setValue] = useState(initial ?? today)

  return (
    <div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        เลือกวันที่
      </h1>

      <p
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: 28,
          fontFamily: 'var(--font-thai)',
        }}
      >
        เลือกวันที่บันทึกรายการ
      </p>

      <div
        style={{
          background: '#F7F7F7',
          border: '2px solid var(--accent)',
          borderRadius: 16,
          padding: '16px 20px',
          marginBottom: 20,
        }}
      >
        <input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 18,
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => setValue(today)}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            background: value === today ? 'var(--accent)' : '#F7F7F7',
            color: value === today ? 'white' : 'var(--text-primary)',
            border: value === today ? 'none' : '1.5px solid var(--border)',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font-thai)',
            cursor: 'pointer',
          }}
        >
          วันนี้
        </button>
        <button
          onClick={() => setValue(yesterday)}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            background: value === yesterday ? 'var(--accent)' : '#F7F7F7',
            color: value === yesterday ? 'white' : 'var(--text-primary)',
            border: value === yesterday ? 'none' : '1.5px solid var(--border)',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font-thai)',
            cursor: 'pointer',
          }}
        >
          เมื่อวาน
        </button>
      </div>

      <button
        className="tj-btn-primary"
        style={{ width: '100%' }}
        onClick={() => onNext(value)}
        disabled={!value}
      >
        ต่อไป →
      </button>
    </div>
  )
}
