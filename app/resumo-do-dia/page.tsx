import Footer from '@/components/Footer'
import Link from 'next/link'
import { getTodayDailySummary, listAvailableDates } from '@/lib/daily-summary'

export const revalidate = 60

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

export default function ResumoDoDiaPage() {
  const summary = getTodayDailySummary()
  const availableDates = listAvailableDates()
  const today = new Date().toLocaleDateString('fr-CA', { timeZone: 'America/Sao_Paulo' })

  return (
    <>
      <main className="mx-auto w-full max-w-editorial px-5 py-10 md:px-grid-margin md:py-14">
        <header className="dieline mb-12 rounded-2xl bg-surface px-7 py-10 shadow-sm md:px-12 md:py-14">
          <p className="brand-kicker mb-5">briefing diario</p>
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="brand-poster text-6xl md:text-display-xl">Resumo do dia.</h1>
              <p className="mt-4 font-display text-2xl italic text-muted">{formatDate(today)}</p>
            </div>
            {summary && (
              <div className="rounded-full border border-border bg-bg px-4 py-2">
                <span className="font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted">
                  {summary.articles.length} {summary.articles.length === 1 ? 'analise' : 'analises'} - {formatTime(summary.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </header>

        {!summary || summary.articles.length === 0 ? (
          <section className="brand-card px-8 py-16 text-center">
            <p className="brand-meta mb-4">sem sinal por enquanto</p>
            <p className="font-display text-2xl italic text-muted">
              O Pulso ainda esta processando as noticias do dia.
            </p>
          </section>
        ) : (
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

                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                      {article.key_facts.length > 0 && (
                        <div>
                          <p className="brand-meta mb-3 border-b border-border pb-2 text-text">fatos-chave</p>
                          <ul className="space-y-2">
                            {article.key_facts.slice(0, 3).map((fact, j) => (
                              <li key={j} className="flex gap-3 text-sm leading-relaxed text-text">
                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                                {fact}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {article.why_it_matters && (
                        <div>
                          <p className="brand-meta mb-3 border-b border-border pb-2 text-text">por que importa</p>
                          <p className="text-sm leading-relaxed text-muted">{article.why_it_matters}</p>
                        </div>
                      )}
                      {article.watch_next.length > 0 && (
                        <div>
                          <p className="brand-meta mb-3 border-b border-border pb-2 text-text">monitorar</p>
                          <ul className="space-y-2">
                            {article.watch_next.slice(0, 3).map((item, j) => (
                              <li key={j} className="text-sm leading-relaxed text-muted">{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-8">
                      <Link href={`/post/${article.slug}`} className="btn-soft">Ler analise completa</Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {availableDates.filter(d => d !== today).length > 0 && (
          <section className="mt-12 border-t border-border pt-10">
            <p className="brand-meta mb-5 text-text">edicoes anteriores</p>
            <div className="flex flex-wrap gap-3">
              {availableDates.filter(d => d !== today).map(date => (
                <Link key={date} href={`/resumo-do-dia/${date}`} className="btn-soft">
                  {date}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
