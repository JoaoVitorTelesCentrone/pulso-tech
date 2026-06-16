import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.redirect(new URL('/unsubscribed?status=invalid', request.url))
  }

  const supabase = getSupabase()

  const { error } = await supabase
    .from('subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('id', id)
    .is('unsubscribed_at', null)

  if (error) {
    console.error('[UNSUBSCRIBE] Supabase error:', error)
  }

  return NextResponse.redirect(new URL('/unsubscribed?status=ok', request.url))
}
