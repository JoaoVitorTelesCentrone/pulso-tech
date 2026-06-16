import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabase } from '@/lib/supabase'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// Stripe sends raw body — disable Next.js body parsing
export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[WEBHOOK] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getSupabase()

  switch (event.type) {
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('subscribers')
        .update({ plan: 'free', stripe_subscription_id: null, plan_expires_at: null })
        .eq('stripe_subscription_id', sub.id)
      console.log('[WEBHOOK] Subscription cancelled:', sub.id)
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const plan = sub.status === 'active' || sub.status === 'trialing' ? 'premium' : 'free'
      // period end tracked via billing_cycle_anchor; just sync plan status
      await supabase
        .from('subscribers')
        .update({ plan })
        .eq('stripe_subscription_id', sub.id)
      console.log(`[WEBHOOK] Subscription updated: ${sub.id} → ${plan}`)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      console.warn('[WEBHOOK] Payment failed for customer:', invoice.customer)
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
