import Footer from '@/components/Footer'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { verifyAccessToken, ACCESS_COOKIE } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function BemVindoPage() {
  const cookieStore = cookies()
  const token = cookieStore.get(ACCESS_COOKIE.name)?.value
  const access = token ? await verifyAccessToken(token) : null

  if (!access) redirect('/signup')

  return (
    <>
      <main className="mx-auto flex min-h-[62vh] w-full max-w-editorial items-center px-5 py-16 md:px-grid-margin">
        <section className="dieline max-w-3xl rounded-2xl bg-surface p-8 shadow-sm md:p-12">
          <p className="brand-kicker mb-5">conta ativada</p>
          <h1 className="brand-poster text-5xl md:text-7xl">Bem-vindo ao Premium.</h1>
          <p className="mt-6 max-w-2xl font-display text-2xl italic leading-snug text-muted">
            Sua conta esta ativa. Voce tem acesso a analise completa, resumo diario e materiais premium.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">Ler ultimas analises</Link>
            <Link href="/resumo-do-dia" className="btn-soft">Ver resumo do dia</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
