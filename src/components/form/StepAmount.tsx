import { useState } from 'react'
import { t } from '@/lib/i18n'
import { hasOperator, evalAmountExpression } from '@/lib/calc'
import { fmt } from '@/lib/theme'
import type { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  initial?: string
  onNext: (amount: string) => void
  /** Mirrors the value to the parent as the user types (for swipe-forward) */
  onChange?: (amount: string) => void
}

export function StepAmount({ lang, initial = '', onNext, onChange }: Props) {
  const [value, setValue] = useState(initial)

  // The field accepts +/- expressions ("120+45+30"); only the evaluated
  // total ever leaves this component via onNext, so the draft and
  // handleSave always see a plain number
  const result = evalAmountExpression(value)

  function update(v: string) {
    const clean = v.replace(/[^\d+.\-]/g, '')
    setValue(clean)
    onChange?.(clean)
  }

  function appendOperator(op: '+' | '-') {
    if (value === '' || /[+\-.]$/.test(value)) return
    update(value + op)
  }

  function commit() {
    if (result == null) return
    onNext(String(result))
  }

  const chipStyle: React.CSSProperties = {
    background: 'white',
    border: '1.5px solid #E5E5E5',
    borderRadius: 12,
    padding: '12px 8px',
    boxShadow: '0 2px 0 0 #E5E5E5',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    cursor: 'pointer',
    transition: 'transform 100ms, box-shadow 100ms',
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
      <div>
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
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={value}
            onChange={(e) => update(e.target.value)}
            placeholder="0"
            style={{
              flex: 1,
              // flex items refuse to shrink below their intrinsic width;
              // a 40px input is ~400px wide and overflows the phone
              minWidth: 0,
              width: '100%',
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
              if (e.key === 'Enter') commit()
            }}
          />
        </div>

        {/* Live total while an expression is being typed */}
        {hasOperator(value) && (
          <div
            style={{
              textAlign: 'right',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              marginTop: 8,
              color: result == null ? 'var(--text-secondary)' : 'var(--accent)',
            }}
          >
            {result == null ? '= —' : `= ฿${fmt(result)}`}
          </div>
        )}
      </div>

      {/* Operator chips — the iOS decimal keypad has no + / - keys */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          aria-label="plus"
          style={{ ...chipStyle, flex: 1, fontSize: 20, fontWeight: 700, padding: '8px' }}
          onClick={() => appendOperator('+')}
        >
          +
        </button>
        <button
          aria-label="minus"
          style={{ ...chipStyle, flex: 1, fontSize: 20, fontWeight: 700, padding: '8px' }}
          onClick={() => appendOperator('-')}
        >
          −
        </button>
      </div>

      <button
        className="tj-btn-ghost"
        style={{ width: '100%' }}
        onClick={() => update('')}
      >
        {t('clear', lang)}
      </button>
    </div>
  )
}
