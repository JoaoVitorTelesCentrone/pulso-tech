import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabase } from '@/lib/supabase'
import { signAccessToken, ACCESS_COOKIE } from '@/lib/auth'
import { randomUUID } from 'crypto'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.redirect(new URL('/subscribe?error=missing_session', request.url))
  }

  let session: Stripe.Checkout.Session
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })
  } catch {
    return NextResponse.redirect(new URL('/subscribe?error=invalid_session', request.url))
  }

  if (!session.customer_email) {
    return NextResponse.redirect(new URL('/subscribe?error=no_email', request.url))
  }

  const email = session.customer_email
  const stripeCustomerId = session.customer as string
  const sub = session.subscription as Stripe.Subscription | null
  const stripeSubscriptionId = sub?.id ?? null
  // period end is tracked via webhook (customer.subscription.updated)
  const planExpiresAt: string | null = null

  const supabase = getSupabase()

  const { data: existing } = await supabase
    .from('subscribers')
    .select('id')
    .eq('email', email)
    .single()

  let subscriberId: string

  if (existing) {
    subscriberId = existing.id
    await supabase
      .from('subscribers')
      .update({
        confirmed: true,
        plan: 'premium',
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        plan_expires_at: planExpiresAt,
        unsubscribed_at: null,
      })
      .eq('id', subscriberId)
  } else {
    const { data } = await supabase
      .from('subscribers')
      .insert({
        email,
        lang: 'pt',
        confirmed: true,
        confirm_token: randomUUID(),
        plan: 'premium',
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        plan_expires_at: planExpiresAt,
      })
      .select('id')
      .single()

    if (!data) {
      return NextResponse.redirect(new URL('/subscribe?error=db_error', request.url))
    }
    subscriberId = data.id
  }

  const token = await signAccessToken(subscriberId)
  const response = NextResponse.redirect(new URL('/premium-confirmed', request.url))
  response.cookies.set(ACCESS_COOKIE.name, token, ACCESS_COOKIE.options)

  return response
}
