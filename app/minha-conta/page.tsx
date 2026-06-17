import Footer from '@/components/Footer'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyAccessToken, ACCESS_COOKIE } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

async function getSubscriber(subscriberId: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('subscribers')
    .select('email, plan, stripe_customer_id, plan_expires_at, created_at')
    .eq('id', subscriberId)
    .single()
  return data
}

export default async function MinhaContaPage() {
  const cookieStore = cookies()
  const token = cookieStore.get(ACCESS_COOKIE.name)?.value

  if (!token) redirect('/login')

  const access = await verifyAccessToken(token)
  if (!access) redirect('/login')

  const subscriber = await getSubscriber(access.sub)
  if (!subscriber) redirect('/login')

  const memberSince = new Date(subscriber.created_at).toLocaleDateString('pt-BR', {
    month: 'long', year: 'numeric',
  })

  return (
    <>
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-16 pb-section-gap">

        {/* Header */}
        <div className="border-b border-warm-gray pb-10 mb-12">
          <p className="font-dm-mono text-[0.6rem] tracking-[0.2em] uppercase text-electric flex items-center gap-3 mb-6">
            <span className="inline-block w-4 h-px bg-electric flex-shrink-0" />
            Minha Conta
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-syne font-extrabold text-ink leading-[0.92] tracking-[-0.04em] text-4xl md:text-5xl mb-2">
                Bem-vindo de volta.
              </h1>
              <p className="font-cormorant font-light text-muted text-xl">{subscriber.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-electric" />
              <span className="font-dm-mono text-[0.6rem] tracking-[0.12em] uppercase text-ink">
                Premium ativo
              </span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-warm-gray mb-12">

          {/* Plan */}
          <div className="bg-cream p-8">
            <p className="font-dm-mono text-[0.58rem] tracking-[0.15em] uppercase text-muted mb-4">Plano</p>
            <p className="font-syne font-extrabold text-ink text-2xl tracking-[-0.03em] mb-1">Pulso Premium</p>
            <p className="font-cormorant font-light text-muted text-base">R$ 29,90/mes</p>
          </div>

          {/* Member since */}
          <div className="bg-cream p-8">
            <p className="font-dm-mono text-[0.58rem] tracking-[0.15em] uppercase text-muted mb-4">Membro desde</p>
            <p className="font-syne font-extrabold text-ink text-2xl tracking-[-0.03em]">{memberSince}</p>
          </div>

          {/* Email */}
          <div className="bg-cream p-8">
            <p className="font-dm-mono text-[0.58rem] tracking-[0.15em] uppercase text-muted mb-4">Email</p>
            <p className="font-syne font-bold text-ink text-lg tracking-[-0.02em] break-all">{subscriber.email}</p>
          </div>

        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <ManageSubscriptionButton />
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full border border-warm-gray text-ink font-syne font-semibold text-[0.75rem] tracking-[0.12em] uppercase px-8 py-4 hover:border-ink transition-colors duration-200 text-left"
            >
              Sair da conta &rarr;
            </button>
          </form>
        </div>

        {/* Quick links */}
        <div className="border-t border-warm-gray pt-10">
          <p className="font-dm-mono text-[0.6rem] tracking-[0.15em] uppercase text-muted mb-6">Acesso rapido</p>
          <div className="flex flex-wrap gap-4">
            {[
              { href: '/', label: 'Home' },
              { href: '/resumo-do-dia', label: 'Resumo do dia' },
              { href: '/archive', label: 'Arquivo' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-dm-mono text-[0.6rem] tracking-[0.1em] uppercase border border-warm-gray px-5 py-3 text-ink hover:bg-ink hover:text-white transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}

function ManageSubscriptionButton() {
  return (
    <form action="/api/stripe/portal" method="POST">
      <button
        type="submit"
        className="w-full bg-ink text-white font-syne font-semibold text-[0.75rem] tracking-[0.12em] uppercase px-8 py-4 hover:bg-electric hover:text-ink transition-colors duration-200 text-left"
      >
        Gerenciar assinatura &rarr;
      </button>
    </form>
  )
}
