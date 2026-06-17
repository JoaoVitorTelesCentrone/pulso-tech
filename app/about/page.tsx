import Footer from '@/components/Footer'
import Link from 'next/link'
import { PulsoMark } from '@/components/PulsoMark'

export default function AboutPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-editorial px-5 py-12 md:px-grid-margin md:py-16">
        <section className="dieline mb-16 rounded-2xl bg-surface px-7 py-10 shadow-sm md:px-12 md:py-14">
          <p className="brand-kicker mb-5">manifesto / pulso tech</p>
          <h1 className="brand-poster max-w-5xl text-6xl md:text-display-xl">
            A inteligencia artificial nao precisa gritar.
          </h1>
          <p className="mt-6 max-w-2xl font-display text-2xl italic leading-snug text-muted">
            O Pulso separa sinal de ruido em IA e tecnologia. O que mudou, por que importa e o que voce pode ignorar.
          </p>
        </section>

        <section className="mb-16 grid gap-8 md:grid-cols-3">
          {[
            ['01', 'Sinal', 'O que aconteceu de fato, sem manchete viral e sem promessa de futuro.'],
            ['02', 'Contexto', 'Por que esse modelo, lei, produto ou pesquisa importa para quem constroi tecnologia.'],
            ['03', 'Ruido', 'O que parece urgente, mas nao merece ocupar sua atencao esta semana.'],
          ].map(([num, title, body]) => (
            <div key={num} className="brand-card p-6">
              <span className="brand-meta text-accent">{num}</span>
              <h2 className="mt-6 font-display text-3xl italic text-text">{title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </section>

        <section className="mb-16 grid gap-10 border-y border-border py-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="flex items-center gap-4">
            <PulsoMark className="h-20" />
            <div>
              <p className="font-brand text-4xl leading-none text-text">Pulso</p>
              <p className="brand-meta">tech / v1</p>
            </div>
          </div>
          <div>
            <p className="font-display text-3xl italic leading-snug text-text">
              Orbita para o sistema, pulso para o que esta vivo agora, faisca para a inteligencia.
            </p>
            <p className="mt-5 leading-relaxed text-muted">
              A identidade visual segue essa metafora: papel creme, tinta preta, um coral editorial e composicoes que parecem pagina impressa de um observatorio tecnologico.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-5 flex items-baseline gap-4">
            <span className="brand-meta text-text">fontes monitoradas</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {['The Gradient', 'Wired', 'MIT Tech Review', 'ArXiv', 'TechCrunch', 'The Verge', 'Ars Technica', 'Reuters Tech'].map(source => (
              <div key={source} className="rounded-md border border-border bg-surface px-5 py-4 shadow-sm">
                <p className="font-body text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-text">{source}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6 rounded-xl bg-text p-8 text-bg shadow-md md:flex-row md:items-center md:justify-between">
          <div>
            <p className="brand-kicker mb-3">receba o pulso</p>
            <h2 className="brand-poster text-4xl text-bg md:text-5xl">Toda analise nova no email.</h2>
          </div>
          <Link href="/subscribe" className="btn-primary flex-shrink-0">Assinar agora</Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
