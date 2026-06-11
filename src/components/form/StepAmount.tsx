import { useState } from 'react'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  initial?: string
  onNext: (amount: string) => void
}

export function StepAmount({ lang, initial = '', onNext }: Props) {
  const [value, setValue] = useState(initial)
  const [activeQuickBtn, setActiveQuickBtn] = useState<number | null>(null)

  const quickAmounts = [
    { label: '+฿100', amount: 100 },
    { label: '+฿500', amount: 500 },
    { label: '+฿1,000', amount: 1000 },
    { label: '+฿5,000', amount: 5000 },
  ]

  const handleQuickAmount = (amount: number, index: number) => {
    setValue((v) => String((Number(v) || 0) + amount))
    setActiveQuickBtn(index)
    setTimeout(() => setActiveQuickBtn(null), 100)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Heading */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 28,
          textAlign: 'center',
          margin: 0,
        }}
      >
        {t('enterAmount', lang)}
      </h1>

      {/* Amount Display Card */}
      <div
        style={{
          background: '#F7F7F7',
          border: '2px solid var(--accent)',
          borderRadius: 16,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--text-secondary)',
            flexShrink: 0,
          }}
        >
          ฿
        </span>
        <input
          type="number"
          inputMode="decimal"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 40,
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            textAlign: 'right',
            color: 'var(--text-primary)',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value && Number(value) > 0) onNext(value)
          }}
        />
      </div>

      {/* Quick Amount Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        {quickAmounts.map((btn, index) => (
          <button
            key={index}
            style={{
              background: 'white',
              border: '1.5px solid #E5E5E5',
              borderRadius: 12,
              padding: '12px 8px',
              boxShadow: activeQuickBtn === index ? '0 1px 0 0 #E5E5E5' : '0 2px 0 0 #E5E5E5',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              transition: 'transform 100ms, box-shadow 100ms',
              transform: activeQuickBtn === index ? 'translateY(1px)' : 'translateY(0)',
            }}
            onClick={() => handleQuickAmount(btn.amount, index)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="tj-btn-primary"
          style={{ width: '100%' }}
          disabled={!value || Number(value) <= 0}
          onClick={() => onNext(value)}
        >
          {t('continue', lang)} →
        </button>
        <button
          className="tj-btn-ghost"
          style={{ width: '100%' }}
          onClick={() => setValue('')}
        >
          {t('clear', lang)}
        </button>
      </div>
    </div>
  )
}
