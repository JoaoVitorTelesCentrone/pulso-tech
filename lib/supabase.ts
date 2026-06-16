import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type Subscriber = {
  id: string
  email: string
  lang: string
  confirmed: boolean
  confirm_token: string
  created_at: string
  unsubscribed_at: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppSupabase = SupabaseClient<any>

export function getSupabase(): AppSupabase {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
