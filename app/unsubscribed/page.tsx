import Link from 'next/link'
import Footer from '@/components/Footer'

export default function UnsubscribedPage() {
  return (
    <>
      <main className="mx-auto flex min-h-[62vh] w-full max-w-editorial items-center px-5 py-16 md:px-grid-margin">
        <section className="dieline max-w-2xl rounded-2xl bg-surface p-8 shadow-sm md:p-12">
          <p className="brand-kicker mb-5">assinatura cancelada</p>
          <h1 className="brand-poster text-5xl md:text-7xl">Voce saiu da lista.</h1>
          <p className="mt-6 font-display text-2xl italic leading-snug text-muted">
            Voce nao recebera mais emails da Pulso Tech. Pode voltar quando quiser.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/subscribe" className="btn-primary">Inscrever novamente</Link>
            <Link href="/" className="btn-soft">Ir para o blog</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
