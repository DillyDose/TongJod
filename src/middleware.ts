import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/server'

const PUBLIC_PATHS = ['/']

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  if (!session && !PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (session && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/callback).*)'],
}
