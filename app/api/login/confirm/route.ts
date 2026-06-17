import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyMagicToken, signAccessToken, ACCESS_COOKIE } from '@/lib/auth'

function supabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/login?error=invalid', req.url))

  const subscriberId = await verifyMagicToken(token)
  if (!subscriberId) return NextResponse.redirect(new URL('/login?error=expired', req.url))

  const { data: subscriber } = await supabase()
    .from('subscribers')
    .select('id, plan')
    .eq('id', subscriberId)
    .maybeSingle()

  if (!subscriber || subscriber.plan !== 'premium') {
    return NextResponse.redirect(new URL('/login?error=invalid', req.url))
  }

  const accessToken = await signAccessToken(subscriber.id)

  const res = NextResponse.redirect(new URL('/', req.url))
  res.cookies.set(ACCESS_COOKIE.name, accessToken, ACCESS_COOKIE.options)
  return res
}
