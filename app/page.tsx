import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getSortedArticlesData } from '@/lib/markdown'
import QuickSubscribeForm from '@/components/QuickSubscribeForm'
import { HeroHeadline } from '@/components/HeroHeadline'

export default function HomePage() {
  const allArticles = getSortedArticlesData()

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-')
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return `${parseInt(d, 10)} de ${months[parseInt(m, 10) - 1]} de ${y}`
  }

  const grouped = allArticles.reduce((acc, curr) => {
    const dateKey = curr.date.split('T')[0]
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(curr)
    return acc
  }, {} as Record<string, typeof allArticles>)

  const sortedDates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1))
  const latestDate = sortedDates[0]
  const todayArticles = latestDate ? grouped[latestDate] : []
  const mainArticle = todayArticles[0]
  const secondaryTodayArticles = todayArticles.slice(1)
  const previousDates = sortedDates.slice(1, 4)

  return (
    <>
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-12">
        {allArticles.length === 0 ? (
          <div className="py-20 text-center">
            <h1 className="font-syne font-bold text-4xl text-ink mb-4">Ainda não há artigos</h1>
            <p className="font-cormorant text-muted text-lg">Aguarde o robô gerar a primeira publicação.</p>
          </div>
        ) : (
          <>
            {/* ── Hero — ink background ── */}
            <header className="bg-ink -mx-6 md:-mx-grid-margin mb-section-gap px-6 md:px-grid-margin py-10 md:py-14 relative overflow-hidden">
              {/* Decorative circle */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full border border-white/[0.06] pointer-events-none"
                style={{ transform: 'translate(50%, -50%)' }}
              />

              {/* Eyebrow */}
              <p className="font-dm-mono text-[0.6rem] tracking-[0.2em] uppercase text-electric flex items-center gap-3 mb-5">
                <span className="inline-block w-4 h-px bg-electric flex-shrink-0" />
                Edição de {formatDate(latestDate)}
              </p>

              {/* Headline */}
              <HeroHeadline title={mainArticle.title} slug={mainArticle.slug} />

              <div className="border-t border-white/10 mb-5 max-w-3xl" />

              {/* Tags */}
              {mainArticle.tags && mainArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {mainArticle.tags.map(tag => (
                    <span key={tag} className="font-dm-mono text-[0.6rem] tracking-[0.15em] uppercase px-3 py-1 border border-electric/60 text-electric/80">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-6 items-center flex-wrap">
                <Link
                  href={`/post/${mainArticle.slug}`}
                  className="inline-block bg-cream text-ink font-syne font-semibold text-[0.78rem] tracking-[0.12em] uppercase px-8 py-[0.9rem] hover:bg-electric transition-colors duration-200"
                >
                  Ler Artigo
                </Link>
                <Link
                  href="/archive"
                  className="text-warm-gray font-dm-mono text-[0.72rem] tracking-[0.1em] uppercase flex items-center gap-2 hover:text-white transition-colors"
                >
                  Ver todos os posts →
                </Link>
              </div>

              {/* Cover image — subtle, aligned right */}
              {mainArticle.image && (
                <div className="absolute right-0 top-0 bottom-0 w-[30%] hidden lg:block opacity-20 pointer-events-none">
                  <Image src={mainArticle.image} alt="" fill sizes="30vw" className="object-cover" />
                </div>
              )}
            </header>

            {/* ── Secondary articles ── */}
            {secondaryTodayArticles.length > 0 && (
              <section className="mb-section-gap">
                <p className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted mb-6">
                  Também na edição de hoje
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
                  {secondaryTodayArticles.map(article => (
                    <Link
                      key={article.slug}
                      href={`/post/${article.slug}`}
                      className="block border-t border-warm-gray py-5 md:pt-4 md:pb-0 group active:bg-paper/60 transition-colors"
                    >
                      <span className="font-dm-mono text-[0.56rem] tracking-[0.12em] uppercase text-muted mb-2 block">
                        {formatDate(article.date.split('T')[0])}
                      </span>
                      <h4 className="font-syne font-bold text-ink text-xl leading-tight group-hover:text-muted transition-colors">
                        {article.title}
                      </h4>
                      <span className="mt-3 inline-flex items-center gap-1 font-dm-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted group-hover:text-ink transition-colors">
                        Ler →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── Ad placeholder ── */}
            <div className="w-full h-20 mb-section-gap border border-warm-gray flex items-center justify-center bg-paper">
              <span className="font-dm-mono text-[0.6rem] tracking-[0.18em] uppercase text-muted">
                Parceria Editorial — Tech&amp;Future
              </span>
            </div>

            {/* ── Editorial grid ── */}
            {previousDates.length > 0 && (
              <section className="grid grid-cols-12 gap-grid-gutter mb-section-gap">
                {/* Left — previous editions */}
                <div className="col-span-12 border border-ink p-8 md:p-12">
                  <p className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted mb-8">
                    Publicações Anteriores
                  </p>
                  <div className="space-y-12">
                    {previousDates.map(date => (
                      <div key={date}>
                        <h3 className="font-dm-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted border-b border-warm-gray pb-2 mb-6">
                          Edição de {formatDate(date)}
                        </h3>
                        <div className="flex flex-col gap-5">
                          {grouped[date].map(article => (
                            <Link
                              key={article.slug}
                              href={`/post/${article.slug}`}
                              className="group flex items-baseline gap-4"
                            >
                              <span className="font-dm-mono text-[0.54rem] tracking-[0.1em] uppercase text-muted flex-shrink-0 pt-[0.3em]">
                                {article.date.split('T')[0].slice(5).replace('-', '/')}
                              </span>
                              <h2 className="font-cormorant font-light text-ink text-2xl leading-tight group-hover:text-muted transition-colors">
                                {article.title}
                              </h2>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 pt-8 border-t border-warm-gray">
                    <Link
                      href="/archive"
                      className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-ink hover:text-muted transition-colors flex items-center gap-2"
                    >
                      Ver todo o arquivo →
                    </Link>
                  </div>
                </div>

              </section>
            )}
          </>
        )}

        {/* ── Newsletter ── */}
        <section className="w-full py-20 border-t border-warm-gray flex flex-col md:flex-row items-start md:items-center justify-between gap-12 mt-12">
          <div className="max-w-md">
            <h4 className="font-cormorant font-light italic text-ink text-3xl mb-4 leading-tight">
              Assine o Pulso
            </h4>
            <p className="font-cormorant font-light text-muted text-lg leading-relaxed">
              O ritmo da tecnologia e IA direto no seu email — toda manhã às 06h, grátis.
            </p>
          </div>
          <QuickSubscribeForm />
        </section>
      </main>
      <Footer />
    </>
  )
}
