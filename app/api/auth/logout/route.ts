import { NextResponse } from 'next/server'
import { ACCESS_COOKIE } from '@/lib/auth'

export async function POST() {
  const res = NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  )
  res.cookies.set(ACCESS_COOKIE.name, '', {
    ...ACCESS_COOKIE.options,
    maxAge: 0,
  })
  return res
}
