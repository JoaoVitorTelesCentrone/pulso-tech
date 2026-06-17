import Link from 'next/link'
import Footer from '@/components/Footer'
import { getSortedArticlesData } from '@/lib/markdown'

export default function ArchivePage() {
  const allArticles = getSortedArticlesData()

  const monthNames = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

  const getMonthKey = (dateStr: string) => {
    const [y, m] = dateStr.split('T')[0].split('-')
    return `${y}-${m}`
  }

  const getMonthLabel = (monthKey: string) => {
    const [y, m] = monthKey.split('-')
    return {
      month: monthNames[parseInt(m, 10) - 1],
      year: y,
    }
  }

  const getDateLabel = (dateStr: string) => {
    const [, m, d] = dateStr.split('T')[0].split('-')
    const date = new Date(Number(dateStr.slice(0, 4)), Number(m) - 1, Number(d))

    return {
      day: d,
      month: monthNames[parseInt(m, 10) - 1].slice(0, 3),
      weekday: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
    }
  }

  const archiveGroups = allArticles.reduce((acc, curr) => {
    const dateKey = curr.date.split('T')[0]
    const monthKey = getMonthKey(dateKey)
    if (!acc[monthKey]) acc[monthKey] = {}
    if (!acc[monthKey][dateKey]) acc[monthKey][dateKey] = []
    acc[monthKey][dateKey].push(curr)
    return acc
  }, {} as Record<string, Record<string, typeof allArticles>>)

  return (
    <>
      <main className="mx-auto min-h-screen w-full max-w-editorial px-5 py-12 md:px-grid-margin md:py-16">
        <header className="dieline mb-16 rounded-2xl bg-surface px-7 py-10 shadow-sm md:px-12 md:py-14">
          <p className="brand-kicker mb-5">arquivo / registros historicos</p>
          <h1 className="brand-poster max-w-4xl text-6xl md:text-display-xl">
            Arquivo de edicoes.
          </h1>
          <p className="mt-6 max-w-xl font-display text-2xl italic leading-snug text-muted">
            Todas as analises publicadas pela Pulso Tech desde o primeiro sinal.
          </p>
        </header>

        <section className="space-y-14">
          {Object.entries(archiveGroups).map(([monthKey, datesMap]) => {
            const { month, year } = getMonthLabel(monthKey)
            const dates = Object.entries(datesMap)
            const articleCount = dates.reduce((total, [, articles]) => total + articles.length, 0)

            return (
            <div key={monthKey}>
              <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="brand-meta mb-2 text-accent">calendario editorial</p>
                  <h2 className="font-display text-4xl italic leading-none text-text md:text-5xl">
                    {month} <span className="text-muted">{year}</span>
                  </h2>
                </div>
                <div className="rounded-full border border-border bg-surface px-4 py-2 shadow-sm">
                  <span className="brand-meta">
                    {dates.length} {dates.length === 1 ? 'edicao' : 'edicoes'} / {articleCount} {articleCount === 1 ? 'texto' : 'textos'}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-border rounded-lg border border-border bg-surface shadow-sm">
                {dates.map(([date, articlesList]) => {
                  const label = getDateLabel(date)

                  return (
                  <div key={date} className="grid gap-0 md:grid-cols-[140px_1fr]">
                    <div className="border-b border-border bg-bg p-5 md:border-b-0 md:border-r">
                      <p className="brand-meta text-accent">{label.weekday}</p>
                      <div className="mt-3 flex items-end gap-2">
                        <span className="font-headline text-5xl leading-none text-text">{label.day}</span>
                        <span className="pb-1 font-body text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-muted">{label.month}</span>
                      </div>
                      <p className="mt-3 font-display text-sm italic text-muted">
                        {articlesList.length} {articlesList.length === 1 ? 'texto' : 'textos'}
                      </p>
                    </div>
                    <div className="divide-y divide-border">
                      {articlesList.map(article => (
                        <Link key={article.slug} href={`/post/${article.slug}`} className="group block p-5 transition-colors hover:bg-surface-hover">
                          <div className="mb-3 flex flex-wrap gap-2">
                            {article.tags?.slice(0, 3).map(tag => (
                              <span key={tag} className="tag-brand">{tag}</span>
                            ))}
                          </div>
                          <h3 className="font-display text-2xl italic leading-tight text-text transition-colors group-hover:text-accent md:text-3xl">
                            {article.title}
                          </h3>
                        </Link>
                      ))}
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
            )
          })}
        </section>
      </main>
      <Footer />
    </>
  )
}
