'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

const TAB_ORDER = ['/dashboard', '/form', '/budget']

// Module-level so it survives client-side navigation: each page mounts a
// fresh AppShell, which reads where we came from to pick a slide direction.
let lastPath: string | null = null
let prevPath: string | null = null

function recordNav(pathname: string) {
  // Idempotent — React StrictMode double-invokes state initializers
  if (pathname !== lastPath) {
    prevPath = lastPath
    lastPath = pathname
  }
}

function pageAnimClass(from: string | null, to: string): string {
  const fromIdx = from ? TAB_ORDER.indexOf(from) : -1
  const toIdx = TAB_ORDER.indexOf(to)
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return 'anim-fade'
  return toIdx > fromIdx ? 'anim-in-r' : 'anim-in-l'
}

interface Props {
  children: React.ReactNode
  /** Rendered below the animated content, outside the slide — keeps the
   *  bottom nav stationary while pages transition. */
  nav?: React.ReactNode
}

export function AppShell({ children, nav }: Props) {
  const { theme } = useTheme()
  const pathname = usePathname()
  const [animClass] = useState(() => {
    recordNav(pathname)
    return pageAnimClass(prevPath, pathname)
  })

  return (
    <>
      {/* Full-page gradient backdrop (visible on desktop) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: theme.gradient,
          transition: 'background 600ms ease-out',
        }}
      />
      {/* Desktop scrim blur */}
      <div
        className="desktop-scrim"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background: 'rgba(28,25,23,0.22)',
          backdropFilter: 'blur(6px)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Centered phone frame */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        <div
          className="phone-frame"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 480,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-base)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle gradient tint behind content */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              background: theme.gradient,
              opacity: 0.18,
              transition: 'background 500ms ease-out',
              pointerEvents: 'none',
            }}
          />
          {/* Page content — slides in on tab navigation */}
          <div
            className={animClass}
            style={{
              position: 'relative',
              zIndex: 1,
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </div>
          {/* Stationary bottom nav */}
          {nav && (
            <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
              {nav}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .desktop-scrim { opacity: 1 !important; }
        }
      `}</style>
    </>
  )
}
