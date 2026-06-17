import Footer from '@/components/Footer'
import Link from 'next/link'
import { getSortedArticlesData } from '@/lib/markdown'
import QuickSubscribeForm from '@/components/QuickSubscribeForm'
import { HeroHeadline } from '@/components/HeroHeadline'
import { PulsoMark } from '@/components/PulsoMark'

export default function HomePage() {
  const allArticles = getSortedArticlesData()

  const getDateKey = (dateStr: string) => dateStr.split('T')[0]

  const formatDate = (dateStr: string) => {
    const [y, m, d] = getDateKey(dateStr).split('-')
    const months = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    return `${parseInt(d, 10)} de ${months[parseInt(m, 10) - 1]} de ${y}`
  }

  const grouped = allArticles.reduce((acc, curr) => {
    const dateKey = getDateKey(curr.date)
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(curr)
    return acc
  }, {} as Record<string, typeof allArticles>)

  const sortedDates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1))
  const latestDate = sortedDates[0]
  const todayArticles = latestDate ? grouped[latestDate] : []
  const mainArticle = todayArticles[0]
  const secondaryTodayArticles = todayArticles.slice(1, 5)
  const previousArticles = sortedDates.slice(1).flatMap(date => grouped[date]).slice(0, 8)
  const editionNumber = String(sortedDates.length).padStart(3, '0')

  return (
    <>
      <main className="mx-auto w-full max-w-editorial px-5 py-8 md:px-grid-margin md:py-12">
        {allArticles.length === 0 ? (
          <section className="brand-card dieline px-8 py-20 text-center">
            <p className="brand-kicker mb-4">nr. 000 - aguardando sinal</p>
            <h1 className="brand-poster mx-auto max-w-3xl text-5xl md:text-7xl">Ainda nao ha artigos</h1>
            <p className="mx-auto mt-6 max-w-lg font-display text-xl italic text-muted">
              O primeiro pulso editorial ainda esta sendo gerado.
            </p>
          </section>
        ) : (
          <>
            <section className="dieline relative mb-16 overflow-hidden rounded-2xl bg-text px-6 py-10 text-bg shadow-md md:px-14 md:py-16">
              <svg className="absolute right-[-12%] top-8 hidden h-[420px] w-[58%] opacity-15 lg:block" viewBox="0 0 800 420" aria-hidden="true">
                <g transform="rotate(-14 400 210)">
                  <ellipse cx="400" cy="210" rx="350" ry="118" fill="none" stroke="#F2EDDF" strokeWidth="4" />
                  <ellipse cx="400" cy="210" rx="260" ry="88" fill="none" stroke="#F2EDDF" strokeWidth="2" strokeDasharray="8 12" />
                </g>
                <path d="M 60 230 L 170 230 L 202 164 L 242 292 L 282 134 L 338 318 L 388 132 L 438 318 L 480 176 L 514 230 L 740 230" stroke="#FF6B49" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="relative max-w-5xl">
                <div className="mb-10 flex items-center justify-between gap-6 border-b border-[#2D2A36] pb-5">
                  <div className="flex items-center gap-3">
                    <PulsoMark inverted className="h-10" />
                    <span className="font-body text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#B8B3A0]">nr. {editionNumber} - pulso tech</span>
                  </div>
                  <span className="hidden font-display text-sm italic text-[#B8B3A0] md:block">
                    {formatDate(latestDate)}
                  </span>
                </div>

                <p className="mb-5 font-display text-xl italic text-[#B8B3A0]">
                  o ritmo da <span className="text-accent">inteligencia artificial</span> sem o ruido.
                </p>
                <HeroHeadline title={mainArticle.title} slug={mainArticle.slug} />

                <div className="mb-8 flex flex-wrap gap-2">
                  {mainArticle.tags?.slice(0, 4).map(tag => (
                    <span key={tag} className="tag-brand bg-[#1A1820] text-accent">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link href={`/post/${mainArticle.slug}`} className="btn-primary">
                    Ler sinal principal
                  </Link>
                  <Link href="/resumo-do-dia" className="font-body text-xs font-extrabold uppercase tracking-[0.12em] text-[#B8B3A0] hover:text-bg">
                    Ver resumo do dia
                  </Link>
                </div>
              </div>
            </section>

            {secondaryTodayArticles.length > 0 && (
              <section className="mb-16">
                <div className="mb-5 flex items-baseline gap-4">
                  <span className="brand-meta text-text">01 / tambem hoje</span>
                  <span className="h-px flex-1 bg-border" />
                  <span className="font-display text-sm italic text-muted">sinais em rotacao</span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {secondaryTodayArticles.map((article, i) => (
                    <Link key={article.slug} href={`/post/${article.slug}`} className="brand-card group flex min-h-[220px] flex-col justify-between p-6">
                      <div>
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <span className="brand-meta">{String(i + 2).padStart(2, '0')}</span>
                          <span className="h-2 w-2 rounded-full bg-accent" />
                        </div>
                        <h2 className="font-display text-2xl italic leading-tight text-text md:text-3xl">
                          {article.title}
                        </h2>
                      </div>
                      <span className="mt-8 font-body text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-accent">
                        Abrir analise
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-16 grid gap-6 border-y border-border py-12 md:grid-cols-[0.9fr_1.4fr] md:gap-12">
              <div>
                <p className="brand-kicker mb-4">newsletter / ia & tecnologia</p>
                <h2 className="brand-poster text-5xl md:text-7xl">
                  Toda nova<br />analise no email.
                </h2>
              </div>
              <div className="flex flex-col justify-end gap-6">
                <p className="max-w-xl font-display text-2xl italic leading-snug text-muted">
                  Cada post nasce com um briefing privado. Quando o sinal sai, o email sai junto.
                </p>
                <QuickSubscribeForm />
              </div>
            </section>

            {previousArticles.length > 0 && (
              <section className="mb-12">
                <div className="mb-5 flex items-baseline gap-4">
                  <span className="brand-meta text-text">02 / arquivo recente</span>
                  <span className="h-px flex-1 bg-border" />
                  <Link href="/archive" className="font-body text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-accent hover:text-accent-hover">
                    Ver arquivo
                  </Link>
                </div>
                <div className="divide-y divide-border rounded-lg border border-border bg-surface shadow-sm">
                  {previousArticles.map(article => (
                    <Link key={article.slug} href={`/post/${article.slug}`} className="grid gap-3 p-5 transition-colors hover:bg-surface-hover md:grid-cols-[120px_1fr_auto] md:items-center">
                      <span className="brand-meta">{article.date.split('T')[0].slice(5).replace('-', '/')}</span>
                      <h3 className="font-display text-xl italic leading-tight text-text">{article.title}</h3>
                      <span className="font-body text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-faint">Ler</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
