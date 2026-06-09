import { TrendingUp, TrendingDown } from 'lucide-react'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  onSelect: (type: 'income' | 'expense') => void
}

export function StepType({ lang, onSelect }: Props) {
  const options = [
    { type: 'income'  as const, Icon: TrendingUp,   bg: 'rgba(16,185,129,0.08)', color: '#059669' },
    { type: 'expense' as const, Icon: TrendingDown,  bg: 'rgba(239,68,68,0.08)',  color: '#DC2626' },
  ]

  return (
    <div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 24,
          marginBottom: 32,
          textAlign: 'center',
        }}
      >
        {t('formType', lang)}
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {options.map(({ type, Icon, bg, color }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: bg,
              border: `1.5px solid ${color}20`,
              borderRadius: 'var(--r-lg)',
              padding: '20px 24px',
              cursor: 'pointer',
              transition: 'transform 120ms ease-out',
              width: '100%',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
          >
            <Icon size={28} color={color} />
            <span
              style={{
                fontFamily: 'var(--font-thai)',
                fontWeight: 600,
                fontSize: 18,
                color: 'var(--text-primary)',
              }}
            >
              {t(type, lang)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
