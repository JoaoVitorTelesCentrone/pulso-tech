import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDailySummaryByDate, listAvailableDates } from '@/lib/daily-summary'

export async function generateStaticParams() {
  return listAvailableDates().map(date => ({ date }))
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  })
}

export default function ResumoPorDataPage({ params }: { params: { date: string } }) {
  const summary = getDailySummaryByDate(params.date)
  if (!summary) notFound()

  return (
    <>
      <main className="mx-auto w-full max-w-editorial px-5 py-10 md:px-grid-margin md:py-14">
        <Link href="/resumo-do-dia" className="mb-8 inline-block font-body text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-faint transition-colors hover:text-accent">
          Resumo de hoje
        </Link>

        <header className="dieline mb-12 rounded-2xl bg-surface px-7 py-10 shadow-sm md:px-12 md:py-14">
          <p className="brand-kicker mb-5">edicao anterior</p>
          <h1 className="brand-poster text-5xl md:text-7xl">{formatDate(summary.date)}</h1>
          <p className="mt-4 font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted">
            {summary.articles.length} {summary.articles.length === 1 ? 'analise' : 'analises'}
          </p>
        </header>

        <section className="space-y-5">
          {summary.articles.map((article, i) => (
            <article key={article.slug} className="brand-card overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[260px_1fr]">
                {article.image ? (
                  <img src={article.image} alt={article.title} className="h-64 w-full object-cover grayscale lg:h-full" />
                ) : (
                  <div className="hidden bg-surface-2 lg:block" />
                )}
                <div className="p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="brand-meta text-accent">{String(i + 1).padStart(2, '0')}</span>
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag-brand">{tag}</span>
                    ))}
                    <span className="brand-meta ml-auto">{formatTime(article.generatedAt)}</span>
                  </div>
                  <h2 className="font-display text-3xl italic leading-tight text-text md:text-4xl">{article.title}</h2>
                  <p className="mt-4 max-w-3xl font-body leading-relaxed text-muted">{article.tldr}</p>
                  <div className="mt-8">
                    <Link href={`/post/${article.slug}`} className="btn-soft">Ler analise completa</Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}
