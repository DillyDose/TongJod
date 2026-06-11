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
    <main
      className="phone-frame"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        background: 'linear-gradient(to bottom, #58CC02, #58A700)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blur circles */}
      <div
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          top: 30,
          left: -60,
          borderRadius: 9999,
          background: 'white',
          opacity: 0.08,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 250,
          height: 250,
          top: 80,
          right: -80,
          borderRadius: 9999,
          background: 'white',
          opacity: 0.08,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 180,
          height: 180,
          top: '35%',
          left: -50,
          borderRadius: 9999,
          background: 'white',
          opacity: 0.06,
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero content — centered in top area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          paddingBottom: 24,
        }}
      >
        {/* Icon card */}
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 28,
            background: 'white',
            boxShadow: '0 8px 0 0 #58A700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 52, lineHeight: 1 }}>💰</span>
        </div>

        {/* App name */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 40,
            fontWeight: 800,
            color: 'white',
            marginBottom: 8,
          }}
        >
          TongJod
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: 'var(--font-thai)',
            fontSize: 15,
            color: '#DCFCE7',
            textAlign: 'center',
            maxWidth: 220,
            margin: 0,
          }}
        >
          จดง่าย จ่ายสนุก สร้างวินัยการเงินไปกับเรา
        </p>
      </div>

      {/* White bottom sheet */}
      <div
        style={{
          background: 'white',
          borderRadius: '32px 32px 0 0',
          padding: '40px 24px 48px',
          zIndex: 2,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 700,
            textAlign: 'center',
            color: 'var(--text-primary)',
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          เริ่มต้นใช้งาน
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-thai)',
            fontSize: 14,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: 32,
            marginTop: 0,
          }}
        >
          เข้าสู่ระบบเพื่อบันทึกและซิงค์ข้อมูลของคุณ
        </p>

        {/* Google sign-in button */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 16,
            background: 'white',
            border: '1px solid #E5E5E5',
            boxShadow: '0 4px 0 0 #E5E5E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'transform 120ms, box-shadow 120ms',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(4px)'
            e.currentTarget.style.boxShadow = '0 0px 0 0 #E5E5E5'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = '0 4px 0 0 #E5E5E5'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = '0 4px 0 0 #E5E5E5'
          }}
        >
          {/* Google logo */}
          <svg width="24" height="24" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h12.93c-.56 2.84-2.24 5.25-4.79 6.87v5.71h7.75c4.54-4.18 7.09-10.35 7.09-17.54z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.15 15.9-5.84l-7.75-5.71c-2.15 1.44-4.9 2.29-8.15 2.29-6.26 0-11.57-4.23-13.47-9.91H2.52v5.9C6.48 42.57 14.69 48 24 48z" />
            <path fill="#FBBC05" d="M10.53 28.83A14.88 14.88 0 0 1 9.5 24c0-1.68.29-3.31.81-4.83v-5.9H2.52A23.93 23.93 0 0 0 0 24c0 3.87.93 7.54 2.52 10.73l8.01-5.9z" />
            <path fill="#EA4335" d="M24 9.52c3.53 0 6.69 1.21 9.18 3.59l6.87-6.87C35.93 2.38 30.48 0 24 0 14.69 0 6.48 5.43 2.52 13.27l8.01 5.9C12.43 13.75 17.74 9.52 24 9.52z" />
          </svg>
          Sign in with Google
        </button>

        {/* Privacy note */}
        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            color: 'var(--text-muted)',
            textAlign: 'center',
            fontFamily: 'var(--font-thai)',
          }}
        >
          การเข้าสู่ระบบแสดงว่าคุณยอมรับ
          <br />
          <a href="#" style={{ color: '#58CC02', textDecoration: 'underline', fontWeight: 600 }}>
            ข้อกำหนดในการให้บริการ
          </a>{' '}
          และ{' '}
          <a href="#" style={{ color: '#58CC02', textDecoration: 'underline', fontWeight: 600 }}>
            นโยบายความเป็นส่วนตัว
          </a>
        </p>
      </div>
    </main>
  )
}
