import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function UnsubscribedPage() {
  return (
    <>
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-24 min-h-[60vh] flex flex-col justify-center">
        <div className="max-w-lg">
          <p className="font-dm-mono text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-6">
            Assinatura cancelada
          </p>

          <h1 className="font-syne font-extrabold text-ink leading-[0.9] tracking-[-0.04em] text-4xl md:text-5xl mb-8">
            Você foi removido da lista
          </h1>

          <div className="w-12 h-px bg-warm-gray mb-8" />

          <p className="font-cormorant font-light text-muted text-xl leading-relaxed mb-10">
            Lamentamos ver você partir. Você não receberá mais emails do Tech&amp;Future Morning Report.
            Se mudar de ideia, pode se inscrever novamente a qualquer momento.
          </p>

          <div className="flex gap-8">
            <Link
              href="/subscribe"
              className="inline-block font-dm-mono text-[0.65rem] tracking-[0.12em] uppercase text-ink border-b border-ink pb-0.5 hover:text-muted hover:border-muted transition-colors"
            >
              Inscrever-se novamente
            </Link>
            <Link
              href="/"
              className="inline-block font-dm-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted hover:text-ink transition-colors"
            >
              ← Ir para o blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
