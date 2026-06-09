'use client'
import { useTheme } from './ThemeProvider'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

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
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 480,
            minHeight: '100vh',
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
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </div>
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
