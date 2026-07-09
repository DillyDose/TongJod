'use client'
import { useEffect } from 'react'

// Catches errors thrown by the root layout itself (rare — RootLayout is
// mostly just ThemeProvider + children), which route-level error.tsx can't
// catch since it also lives inside that layout. Replaces the entire
// <html>, so it can't rely on globals.css tokens being loaded.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="th">
      <body>
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            padding: '0 24px',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
            background: '#fff8f5',
            color: '#1e1b19',
          }}
        >
          <span style={{ fontSize: 44 }}>😵</span>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>
              เกิดข้อผิดพลาดบางอย่าง
            </h1>
            <p style={{ fontSize: 14, color: '#777777' }}>
              ลองรีเฟรชหน้านี้อีกครั้ง
            </p>
          </div>
          <button
            onClick={() => reset()}
            style={{
              width: '100%',
              maxWidth: 320,
              height: 52,
              borderRadius: 16,
              background: '#58CC02',
              color: 'white',
              border: 'none',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            ลองอีกครั้ง
          </button>
        </div>
      </body>
    </html>
  )
}
