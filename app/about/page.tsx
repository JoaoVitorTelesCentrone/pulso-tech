import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-16 pb-section-gap">

        {/* Hero */}
        <section className="border-b border-warm-gray pb-16 mb-16">
          <p className="font-dm-mono text-[0.6rem] tracking-[0.2em] uppercase text-electric flex items-center gap-3 mb-8">
            <span className="inline-block w-4 h-px bg-electric flex-shrink-0" />
            Manifesto
          </p>
          <h1 className="font-syne font-extrabold text-ink leading-[0.92] tracking-[-0.04em] text-4xl md:text-5xl lg:text-display-xl mb-8 max-w-3xl">
            O ritmo da tecnologia, no seu email.
          </h1>
          <p className="font-cormorant font-light text-muted text-xl md:text-2xl leading-relaxed max-w-2xl">
            Todo dia, a IA monitora centenas de fontes — de papers de pesquisa a fóruns técnicos —
            e sintetiza o que realmente importa em um briefing direto. Você acorda às 06h com tudo que precisa saber.
          </p>
        </section>

        {/* Two columns */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-section-gap">
          <div>
            <h2 className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted border-b border-warm-gray pb-3 mb-6">
              Por que o Pulso existe
            </h2>
            <p className="font-cormorant font-light text-ink text-lg leading-relaxed mb-4">
              Tecnologia avança rápido demais para acompanhar manualmente. São dezenas de newsletters,
              centenas de artigos, milhares de posts — todo dia.
            </p>
            <p className="font-cormorant font-light text-muted text-lg leading-relaxed">
              O Pulso resolve isso com uma premissa simples: IA lê tudo, você recebe o essencial.
              Sem hype, sem clickbait, sem perda de tempo.
            </p>
          </div>
          <div>
            <h2 className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted border-b border-warm-gray pb-3 mb-6">
              Como funciona
            </h2>
            <div className="flex flex-col gap-5">
              {[
                ['01', 'Monitoramento', 'A IA varre mais de 400 fontes globais em tempo real — Reuters, ArXiv, blogs técnicos, fóruns.'],
                ['02', 'Síntese', 'Clusters de notícias relacionadas são identificados e transformados em análises coerentes.'],
                ['03', 'Entrega', 'O briefing chega no seu email às 06h BRT, todos os dias úteis.'],
              ].map(([num, title, desc]) => (
                <div key={num} className="flex gap-5">
                  <span className="font-dm-mono text-[0.6rem] text-muted mt-1 flex-shrink-0">{num}</span>
                  <div>
                    <p className="font-syne font-semibold text-ink text-sm mb-1">{title}</p>
                    <p className="font-cormorant font-light text-muted text-base leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand mark */}
        <section className="bg-ink px-10 py-12 md:py-16 mb-section-gap flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-20">
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="inline-block w-4 h-4 rounded-full bg-electric" />
            <span className="font-syne font-extrabold text-white text-4xl tracking-[-0.04em]">Pulso</span>
          </div>
          <div>
            <p className="font-dm-mono text-[0.6rem] tracking-[0.18em] uppercase text-electric mb-3">Fundado em 2026</p>
            <p className="font-cormorant font-light text-warm-gray text-lg leading-relaxed max-w-xl">
              Criado por JV Centrone como um experimento em jornalismo autônomo — onde a curadoria
              é feita por IA, mas a identidade editorial é inteiramente humana.
            </p>
          </div>
        </section>

        {/* Sources */}
        <section className="mb-section-gap">
          <p className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted mb-8">Fontes que monitoramos</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-warm-gray">
            {[
              'The Gradient', 'Wired', 'MIT Tech Review', 'ArXiv.org',
              'TechCrunch', 'The Verge', 'Ars Technica', 'Reuters Tech',
            ].map(source => (
              <div key={source} className="bg-cream px-6 py-5">
                <p className="font-dm-mono text-[0.65rem] tracking-[0.08em] uppercase text-ink">{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-warm-gray pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-syne font-extrabold text-ink text-2xl md:text-3xl tracking-[-0.03em] mb-2">
              Pronto para receber o Pulso?
            </h3>
            <p className="font-cormorant font-light text-muted text-lg">Grátis. Todo dia. Sem spam.</p>
          </div>
          <Link
            href="/subscribe"
            className="inline-block bg-ink text-white font-syne font-semibold text-[0.78rem] tracking-[0.12em] uppercase px-10 py-4 hover:bg-electric hover:text-ink transition-colors duration-200 flex-shrink-0"
          >
            Assinar agora →
          </Link>
        </section>

      </main>
      <Footer />
    </>
  )
}
