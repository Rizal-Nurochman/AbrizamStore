import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ambil cookie 'Authorization'
  const authCookie = request.cookies.get('Authorization')
  const isAuthenticated = !!authCookie

  // Tentukan rute yang dilindungi dan rute auth
  const isProtectedRoute = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  // Skenario 1: User belum login mengakses rute dilindungi -> Redirect ke /login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Skenario 2: User sudah login mengakses rute auth -> Redirect ke /dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Jika tidak masuk skenario di atas, lanjutkan request
  return NextResponse.next()
}

// Konfigurasi Matcher
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ],
}
