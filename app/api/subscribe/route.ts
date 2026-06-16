import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/resend'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: { email?: string; lang?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const email = (body.email || '').trim().toLowerCase()
  const lang = ['pt', 'en', 'bilingual'].includes(body.lang || '') ? body.lang! : 'pt'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const supabase = getSupabase()

  // Check if already confirmed
  const { data: existing } = await supabase
    .from('subscribers')
    .select('id, confirmed, unsubscribed_at')
    .eq('email', email)
    .single()

  if (existing?.confirmed && !existing.unsubscribed_at) {
    return NextResponse.json({ error: 'Este email já está inscrito e confirmado.' }, { status: 409 })
  }

  const confirm_token = randomUUID()

  if (existing) {
    // Re-subscribe: update token, reset status
    await supabase
      .from('subscribers')
      .update({ lang, confirmed: false, confirm_token, unsubscribed_at: null })
      .eq('email', email)
  } else {
    const { error } = await supabase
      .from('subscribers')
      .insert({ email, lang, confirmed: false, confirm_token })

    if (error) {
      console.error('[SUBSCRIBE] Supabase insert error:', error)
      return NextResponse.json({ error: 'Erro ao salvar. Tente novamente.' }, { status: 500 })
    }
  }

  try {
    await sendConfirmationEmail(email, confirm_token)
  } catch (err) {
    console.error('[SUBSCRIBE] Resend error:', err)
    return NextResponse.json({ error: 'Erro ao enviar email de confirmação.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
