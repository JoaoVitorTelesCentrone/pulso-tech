import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { signMagicToken } from '@/lib/auth'
import { sendLoginEmail } from '@/lib/resend'

function supabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email obrigatório.' }, { status: 400 })

  const { data: subscriber } = await supabase()
    .from('subscribers')
    .select('id, plan, confirmed')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()

  // Always return 200 to avoid email enumeration
  if (!subscriber || !subscriber.confirmed || subscriber.plan !== 'premium') {
    return NextResponse.json({ ok: true })
  }

  const token = await signMagicToken(subscriber.id)

  try {
    await sendLoginEmail(email, token)
  } catch (err) {
    console.error('[LOGIN] Erro ao enviar email:', err)
    return NextResponse.json({ error: 'Erro ao enviar email.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
