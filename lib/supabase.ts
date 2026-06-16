import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type Subscriber = {
  id: string
  email: string
  lang: string
  confirmed: boolean
  confirm_token: string
  created_at: string
  unsubscribed_at: string | null
  plan: 'free' | 'premium'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan_expires_at: string | null
}

export type AppSupabase = SupabaseClient<any>

export function getSupabase(): AppSupabase {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
