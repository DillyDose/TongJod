'use client'
import { useEffect } from 'react'

// Route-segment error boundary: without this, an uncaught render exception
// anywhere in a page unmounts the whole React tree with nothing shown in
// its place — the "blank page" a user sees after tapping Save is very
// likely this happening silently. Data is often already saved (the crash
// tends to hit the confirmation screen after a successful write), so this
// points people back to the dashboard to check rather than implying data loss.
export default function Error({
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
        background: 'var(--bg-base)',
      }}
    >
      <span style={{ fontSize: 44 }}>😵</span>
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 22,
            marginBottom: 8,
            color: 'var(--text-primary)',
          }}
        >
          เกิดข้อผิดพลาดบางอย่าง
        </h1>
        <p style={{ fontFamily: 'var(--font-thai)', fontSize: 14, color: 'var(--text-secondary)' }}>
          ถ้ากดบันทึกอยู่ ข้อมูลอาจถูกบันทึกไปแล้ว ลองกลับไปเช็คที่หน้าหลักได้เลย
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
        <button className="tj-btn-primary" style={{ width: '100%' }} onClick={() => reset()}>
          ลองอีกครั้ง
        </button>
        <button
          className="tj-btn-ghost"
          style={{ width: '100%' }}
          onClick={() => { window.location.href = '/dashboard' }}
        >
          กลับไปหน้าหลัก
        </button>
      </div>
    </div>
  )
}
