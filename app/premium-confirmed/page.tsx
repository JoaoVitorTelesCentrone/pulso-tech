import Link from 'next/link'
import Footer from '@/components/Footer'

export default function PremiumConfirmedPage() {
  return (
    <>
      <main className="mx-auto flex min-h-[62vh] w-full max-w-editorial items-center px-5 py-16 md:px-grid-margin">
        <section className="dieline max-w-2xl rounded-2xl bg-surface p-8 shadow-sm md:p-12">
          <p className="brand-kicker mb-5">premium ativo</p>
          <h1 className="brand-poster text-5xl md:text-7xl">Conta premium ativa.</h1>
          <p className="mt-6 font-display text-2xl italic leading-snug text-muted">
            Voce tem acesso completo as analises, briefings e materiais visuais premium.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">Ver edicao de hoje</Link>
            <Link href="/subscribe" className="btn-soft">Gerenciar assinatura</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
