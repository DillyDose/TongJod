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
        height: 80,
        flexShrink: 0,
        background: 'var(--surface)',
        boxShadow: '0 -4px 0 0 #E5E5E5',
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
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  background: theme.accent,
                  boxShadow: `0 4px 0 0 ${theme.shadow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 100ms ease-out, box-shadow 100ms ease-out',
                }}
                onMouseDown={e => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(2px)'
                  el.style.boxShadow = `0 2px 0 0 ${theme.shadow}`
                }}
                onMouseUp={e => {
                  const el = e.currentTarget
                  el.style.transform = 'none'
                  el.style.boxShadow = `0 4px 0 0 ${theme.shadow}`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.transform = 'none'
                  el.style.boxShadow = `0 4px 0 0 ${theme.shadow}`
                }}
                onTouchStart={e => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(2px)'
                  el.style.boxShadow = `0 2px 0 0 ${theme.shadow}`
                }}
                onTouchEnd={e => {
                  const el = e.currentTarget
                  el.style.transform = 'none'
                  el.style.boxShadow = `0 4px 0 0 ${theme.shadow}`
                }}
              >
                <Icon size={28} color="#fff" strokeWidth={2.4} />
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
            }}
          >
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                background: active ? theme.pillBg : 'transparent',
                borderRadius: active ? 12 : 0,
                padding: active ? '8px 16px' : '8px 16px',
              }}
            >
              <Icon
                size={22}
                color={active ? theme.accent : '#AAAAAA'}
                strokeWidth={active ? 2.3 : 2}
              />
              <span
                style={{
                  fontFamily: 'var(--font-thai)',
                  fontSize: 12,
                  fontWeight: active ? 700 : 400,
                  color: active ? theme.accent : '#AAAAAA',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
