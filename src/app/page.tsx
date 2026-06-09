'use client'
import { getSupabase } from '@/lib/supabase/client'

export default function LoginPage() {
  async function handleGoogleSignIn() {
    const supabase = getSupabase()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? location.origin}/auth/callback` },
    })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--app-gradient)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 48,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          TongJod
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-thai)',
            color: 'var(--text-secondary)',
            marginTop: 8,
            fontSize: 16,
          }}
        >
          จดทุกบาท ใช้ชีวิตสบายใจ
        </p>
      </div>

      <button
        onClick={handleGoogleSignIn}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          padding: '14px 28px',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: 16,
          color: 'var(--text-primary)',
          cursor: 'pointer',
          boxShadow: 'var(--sh-card)',
          width: 280,
          justifyContent: 'center',
          transition: 'box-shadow 150ms, transform 120ms',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
      >
        {/* Google logo */}
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h12.93c-.56 2.84-2.24 5.25-4.79 6.87v5.71h7.75c4.54-4.18 7.09-10.35 7.09-17.54z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.15 15.9-5.84l-7.75-5.71c-2.15 1.44-4.9 2.29-8.15 2.29-6.26 0-11.57-4.23-13.47-9.91H2.52v5.9C6.48 42.57 14.69 48 24 48z" />
          <path fill="#FBBC05" d="M10.53 28.83A14.88 14.88 0 0 1 9.5 24c0-1.68.29-3.31.81-4.83v-5.9H2.52A23.93 23.93 0 0 0 0 24c0 3.87.93 7.54 2.52 10.73l8.01-5.9z" />
          <path fill="#EA4335" d="M24 9.52c3.53 0 6.69 1.21 9.18 3.59l6.87-6.87C35.93 2.38 30.48 0 24 0 14.69 0 6.48 5.43 2.52 13.27l8.01 5.9C12.43 13.75 17.74 9.52 24 9.52z" />
        </svg>
        เข้าสู่ระบบด้วย Google
      </button>
    </div>
  )
}
