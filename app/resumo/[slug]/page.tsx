import { notFound } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { getSummary } from '@/lib/content-data'
import { getSortedArticlesData } from '@/lib/markdown'

export default function ResumoPage({ params }: { params: { slug: string } }) {
  const summary = getSummary(params.slug)
  if (!summary) notFound()

  const articles = getSortedArticlesData()
  const article = articles.find(a => a.slug === params.slug)
  const title = article?.title || params.slug

  return (
    <>
      <main className="mx-auto w-full max-w-editorial px-5 py-10 md:px-grid-margin md:py-14">
        <div className="mx-auto max-w-4xl">
          <Link href={`/post/${params.slug}`} className="mb-8 inline-block font-body text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-faint transition-colors hover:text-accent">
            Voltar ao artigo
          </Link>

          <header className="mb-10 border-b border-border pb-10">
            <p className="brand-kicker mb-5">briefing editorial</p>
            <h1 className="brand-poster max-w-5xl text-5xl md:text-7xl">{title}</h1>
          </header>

          <section className="dieline mb-10 rounded-xl bg-text p-8 text-bg shadow-md md:p-10">
            <p className="mb-4 font-body text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">TL;DR</p>
            <p className="font-display text-2xl italic leading-snug text-bg md:text-3xl">
              {summary.tldr}
            </p>
          </section>

          {summary.key_facts?.length > 0 && (
            <section className="mb-10">
              <div className="mb-5 flex items-baseline gap-4">
                <span className="brand-meta text-text">01 / fatos-chave</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <ol className="grid gap-4 md:grid-cols-2">
                {summary.key_facts.map((fact, i) => (
                  <li key={i} className="brand-card p-5">
                    <span className="brand-meta mb-3 block text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <p className="font-body leading-relaxed text-text">{fact}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {summary.why_it_matters && (
              <section className="brand-card p-6">
                <p className="brand-meta mb-4 text-text">02 / por que importa</p>
                <p className="font-display text-xl italic leading-relaxed text-muted">{summary.why_it_matters}</p>
              </section>
            )}

            {summary.editorial_angle && (
              <section className="brand-card p-6">
                <p className="brand-meta mb-4 text-text">03 / angulo editorial</p>
                <p className="font-display text-xl italic leading-relaxed text-muted">{summary.editorial_angle}</p>
              </section>
            )}
          </div>

          {summary.watch_next?.length > 0 && (
            <section className="mt-10 rounded-lg border border-border bg-surface p-6 shadow-sm">
              <p className="brand-meta mb-5 text-text">04 / fique de olho</p>
              <ul className="grid gap-3 md:grid-cols-2">
                {summary.watch_next.map((item, i) => (
                  <li key={i} className="flex gap-3 font-body leading-relaxed text-muted">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
