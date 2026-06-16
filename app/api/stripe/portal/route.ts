import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  const cookieStore = cookies()
  const token = cookieStore.get('tf_access')?.value

  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const payload = await verifyAccessToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  const supabase = getSupabase()
  const { data: subscriber } = await supabase
    .from('subscribers')
    .select('stripe_customer_id')
    .eq('id', payload.sub)
    .single()

  if (!subscriber?.stripe_customer_id) {
    return NextResponse.json({ error: 'Assinatura não encontrada' }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techfuture.com.br'
  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: subscriber.stripe_customer_id,
    return_url: `${siteUrl}/subscribe`,
  })

  return NextResponse.json({ url: portalSession.url })
}
