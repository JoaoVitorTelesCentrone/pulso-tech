import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/confirmed?status=invalid', request.url))
  }

  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('subscribers')
    .update({ confirmed: true })
    .eq('confirm_token', token)
    .eq('confirmed', false)
    .select('id')
    .single()

  if (error || !data) {
    // Token not found or already confirmed
    return NextResponse.redirect(new URL('/confirmed?status=already', request.url))
  }

  return NextResponse.redirect(new URL('/confirmed?status=ok', request.url))
}
