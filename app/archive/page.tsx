import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSortedArticlesData } from '@/lib/markdown'

export default function ArchivePage() {
  const allArticles = getSortedArticlesData()

  const getMonthYear = (dateStr: string) => {
    const [y, m] = dateStr.split('T')[0].split('-')
    const months = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO']
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
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-16 min-h-screen">

        {/* Page header */}
        <header className="mb-24">
          <p className="font-dm-mono text-[0.65rem] tracking-[0.2em] uppercase text-muted flex items-center gap-3 mb-8">
            <span className="inline-block w-5 h-px bg-muted flex-shrink-0" />
            Registros Históricos
          </p>
          <h1 className="font-syne font-extrabold text-ink leading-[0.9] tracking-[-0.04em] text-5xl md:text-display-xl mb-6">
            Arquivo de Edições
          </h1>
          <p className="font-cormorant font-light italic text-muted text-2xl max-w-xl leading-relaxed">
            Todas as publicações desde o início.
          </p>
        </header>

        {/* Archive list */}
        <section className="space-y-20">
          {Object.entries(archiveGroups).map(([month, datesMap]) => (
            <div key={month}>
              {/* Month heading */}
              <h2 className="font-dm-mono text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-8 flex items-center gap-4">
                {month}
                <span className="flex-grow h-px bg-warm-gray" />
              </h2>

              <div className="space-y-12">
                {Object.entries(datesMap).map(([date, articlesList]) => (
                  <div key={date} className="border-t border-warm-gray pt-4">
                    <p className="font-dm-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-4">
                      Edição de {getDayMonth(date)}
                    </p>
                    <div className="divide-y divide-warm-gray">
                      {articlesList.map(article => (
                        <Link
                          key={article.slug}
                          href={`/post/${article.slug}`}
                          className="py-4 block group"
                        >
                          <h3 className="font-cormorant font-light text-ink text-2xl md:text-3xl leading-tight group-hover:text-muted transition-colors duration-200 group-hover:translate-x-1 transition-transform">
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

        {/* Load more placeholder */}
        <section className="mt-24 pb-24 text-center">
          <button className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase border border-ink px-12 py-4 text-ink hover:bg-ink hover:text-white transition-colors duration-200">
            Carregar Edições Anteriores
          </button>
        </section>
      </main>
      <Footer />
    </>
  )
}
