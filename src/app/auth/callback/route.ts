import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.redirect(`${origin}/`)

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          ),
      },
    },
  )

  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !session) return NextResponse.redirect(`${origin}/`)

  const user = session.user
  const email = user.email ?? ''
  const displayName = (user.user_metadata?.full_name as string | undefined) ?? ''

  // Check if profile already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id, created_at')
    .eq('id', user.id)
    .single()

  if (!existing) {
    // First login: create profile + seed categories
    await supabase.from('profiles').insert({
      id: user.id,
      email,
      display_name: displayName,
    })

    const expenseNames = [
      'อาหาร', 'เดินทาง', 'ช้อปปิ้ง', 'บิล/ค่าใช้จ่าย',
      'สุขภาพ', 'บันเทิง', 'กาแฟ', 'อื่นๆ',
    ]
    const incomeNames = ['เงินเดือน', 'ฟรีแลนซ์', 'โบนัส', 'อื่นๆ']
    const rows = [
      ...expenseNames.map((name) => ({ user_id: user.id, name, type: 'expense' })),
      ...incomeNames.map((name)  => ({ user_id: user.id, name, type: 'income' })),
    ]
    await supabase.from('categories').insert(rows)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
