'use client'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Plus, Wallet } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

export function BottomNav({ lang }: { lang: Lang }) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()

  const tabs = [
    { path: '/dashboard', Icon: LayoutDashboard, label: t('navHome', lang) },
    { path: '/form', Icon: Plus, label: t('navAdd', lang), primary: true },
    { path: '/budget', Icon: Wallet, label: t('navBudget', lang) },
  ]

  return (
    <div
      style={{
        height: 64,
        flexShrink: 0,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        boxShadow: 'var(--sh-nav)',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {tabs.map(({ path, Icon, label, primary }) => {
        const active = pathname === path

        if (primary) {
          return (
            <div
              key={path}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <button
                onClick={() => router.push(path)}
                aria-label={label}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
                  border: 'none',
                  cursor: 'pointer',
                  background: `linear-gradient(135deg, ${theme.accentLight}, ${theme.accent})`,
                  boxShadow: `0 6px 16px ${theme.cardTint}, var(--sh-button)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: active ? 'translateY(-2px)' : 'none',
                  transition: 'transform 160ms ease-out',
                }}
              >
                <Icon size={26} color="#fff" strokeWidth={2.4} />
              </button>
            </div>
          )
        }

        return (
          <button
            key={path}
            onClick={() => router.push(path)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              position: 'relative',
            }}
          >
            {active && (
              <span
                style={{
                  position: 'absolute',
                  top: 9,
                  width: 16,
                  height: 3,
                  borderRadius: 999,
                  background: theme.accent,
                }}
              />
            )}
            <Icon
              size={22}
              color={active ? theme.accent : 'var(--text-muted)'}
              strokeWidth={active ? 2.3 : 2}
            />
            {active && (
              <span
                style={{
                  fontFamily: 'var(--font-thai)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: theme.accent,
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
