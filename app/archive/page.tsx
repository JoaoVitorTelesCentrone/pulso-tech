import Link from 'next/link'
import Footer from '@/components/Footer'
import { getSortedArticlesData } from '@/lib/markdown'

export default function ArchivePage() {
  const allArticles = getSortedArticlesData()

  const getMonthYear = (dateStr: string) => {
    const [y, m] = dateStr.split('T')[0].split('-')
    const months = ['JANEIRO', 'FEVEREIRO', 'MARCO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO']
    return `${months[parseInt(m, 10) - 1]} ${y}`
  }

  const getDayMonth = (dateStr: string) => {
    const [, m, d] = dateStr.split('T')[0].split('-')
    return `${d}.${m}`
  }

  const archiveGroups = allArticles.reduce((acc, curr) => {
    const dateKey = curr.date.split('T')[0]
    const monthYear = getMonthYear(dateKey)
    if (!acc[monthYear]) acc[monthYear] = {}
    if (!acc[monthYear][dateKey]) acc[monthYear][dateKey] = []
    acc[monthYear][dateKey].push(curr)
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
          {Object.entries(archiveGroups).map(([month, datesMap], monthIndex) => (
            <div key={month}>
              <div className="mb-5 flex items-baseline gap-4">
                <span className="brand-meta text-text">{String(monthIndex + 1).padStart(2, '0')} / {month}</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="divide-y divide-border rounded-lg border border-border bg-surface shadow-sm">
                {Object.entries(datesMap).map(([date, articlesList]) => (
                  <div key={date} className="grid gap-0 md:grid-cols-[140px_1fr]">
                    <div className="border-b border-border p-5 md:border-b-0 md:border-r">
                      <p className="brand-meta text-accent">{getDayMonth(date)}</p>
                      <p className="mt-2 font-display text-sm italic text-muted">edicao</p>
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
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}
