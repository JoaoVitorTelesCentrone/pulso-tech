import Footer from '@/components/Footer'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <main className="mx-auto flex min-h-[62vh] w-full max-w-editorial items-center px-5 py-16 md:px-grid-margin">
        <section className="dieline max-w-2xl rounded-2xl bg-surface p-8 shadow-sm md:p-12">
          <p className="brand-kicker mb-5">erro 404</p>
          <h1 className="brand-poster text-5xl md:text-7xl">Pagina nao encontrada.</h1>
          <p className="mt-6 font-display text-2xl italic leading-snug text-muted">
            O endereco nao existe ou foi removido. O sinal saiu do ar, mas o Pulso continua.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">Voltar ao inicio</Link>
            <Link href="/archive" className="btn-soft">Ver arquivo</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
