import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type DeckMeta = {
  slug: string
  title: string
  slideCount: number
  date: string
}

function getAllDecks(): DeckMeta[] {
  const dir = path.join(process.cwd(), 'data', 'slides')
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const slug = f.replace('.json', '')
      const raw = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'))
      const [y, m, d] = slug.split('-')
      return {
        slug,
        title: raw.title || slug,
        slideCount: Array.isArray(raw.slides) ? raw.slides.length : 0,
        date: `${d}/${m}/${y}`,
      }
    })
    .sort((a, b) => (a.slug < b.slug ? 1 : -1))
}

export default function SlidesIndexPage() {
  const decks = getAllDecks()

  return (
    <>
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-16 min-h-screen">

        {/* Page header */}
        <header className="mb-16">
          <p className="font-dm-mono text-[0.65rem] tracking-[0.2em] uppercase text-muted flex items-center gap-3 mb-8">
            <span className="inline-block w-5 h-px bg-muted flex-shrink-0" />
            Conteúdo Visual
          </p>
          <h1 className="font-syne font-extrabold text-ink leading-[0.9] tracking-[-0.04em] text-5xl md:text-display-xl mb-6">
            Slides
          </h1>
          <p className="font-cormorant font-light italic text-muted text-2xl max-w-xl leading-relaxed">
            Apresentações geradas automaticamente para cada artigo publicado.
          </p>
        </header>

        {decks.length === 0 ? (
          <p className="font-cormorant text-muted text-xl">Nenhum deck disponível ainda.</p>
        ) : (
          <div className="divide-y divide-warm-gray border-t border-warm-gray">
            {decks.map((deck, i) => (
              <Link
                key={deck.slug}
                href={`/slides/${deck.slug}`}
                className="flex items-baseline justify-between py-6 group"
              >
                <div className="flex items-baseline gap-6 min-w-0">
                  <span className="font-dm-mono text-[0.6rem] tracking-[0.1em] text-muted flex-shrink-0 w-6 text-right">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-cormorant font-light text-ink text-2xl leading-tight group-hover:text-muted transition-colors truncate">
                    {deck.title}
                  </h2>
                </div>
                <div className="flex items-center gap-8 flex-shrink-0 ml-8">
                  <span className="font-dm-mono text-[0.6rem] tracking-[0.1em] uppercase text-muted hidden md:block">
                    {deck.slideCount} slides
                  </span>
                  <span className="font-dm-mono text-[0.6rem] tracking-[0.1em] text-muted hidden md:block">
                    {deck.date}
                  </span>
                  <span className="font-dm-mono text-[0.65rem] tracking-[0.1em] uppercase text-ink group-hover:text-muted transition-colors">
                    Ver →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
