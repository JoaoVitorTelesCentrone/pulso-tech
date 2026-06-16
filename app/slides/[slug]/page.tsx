import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SlidesViewer from '@/components/SlidesViewer'
import PremiumGate from '@/components/PremiumGate'
import { getSlideDeck } from '@/lib/content-data'
import { getSortedArticlesData } from '@/lib/markdown'
import { verifyAccessToken } from '@/lib/auth'

export default async function SlidesPage({ params }: { params: { slug: string } }) {
  const deck = getSlideDeck(params.slug)
  if (!deck) notFound()

  const articles = getSortedArticlesData()
  const article = articles.find(a => a.slug === params.slug)
  const title = article?.title || deck.title || params.slug

  const cookieStore = cookies()
  const token = cookieStore.get('tf_access')?.value
  const access = token ? await verifyAccessToken(token) : null
  const isPremium = access?.plan === 'premium'

  return (
    <>
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-12">
        <div className="max-w-4xl mx-auto">

          <Link
            href={`/post/${params.slug}`}
            className="font-label-caps text-label-caps uppercase text-primary hover:underline mb-8 inline-block"
          >
            ← Voltar ao artigo
          </Link>

          <div className="mb-2">
            <span className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-widest">
              Deck de Slides · {deck.slides?.length || 0} slides
            </span>
          </div>

          <h1 className="font-newsreader font-semibold text-primary text-2xl md:text-3xl leading-tight mb-8 border-b border-primary pb-6" style={{ borderBottomWidth: '0.5pt' }}>
            {title}
          </h1>

          {isPremium ? (
            <>
              <SlidesViewer deck={deck} />
              <div className="border-t border-primary pt-8 mt-8 flex flex-wrap gap-4" style={{ borderTopWidth: '0.5pt' }}>
                <Link
                  href={`/resumo/${params.slug}`}
                  className="font-label-caps text-[10px] uppercase tracking-widest text-primary hover:text-accent-coral transition-colors"
                >
                  Ver Briefing →
                </Link>
                <Link
                  href={`/carousel/${params.slug}`}
                  className="font-label-caps text-[10px] uppercase tracking-widest text-primary hover:text-accent-coral transition-colors"
                >
                  Ver Carrossel →
                </Link>
              </div>
            </>
          ) : (
            <PremiumGate articleTitle={title} />
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
