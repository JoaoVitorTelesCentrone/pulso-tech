import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CarouselViewer from '@/components/CarouselViewer'
import { getCarousels } from '@/lib/content-data'
import { getSortedArticlesData } from '@/lib/markdown'

export default function CarouselPage({ params }: { params: { slug: string } }) {
  const carousels = getCarousels(params.slug)
  if (!carousels || carousels.length === 0) notFound()

  const articles = getSortedArticlesData()
  const article = articles.find(a => a.slug === params.slug)
  const title = article?.title || params.slug

  return (
    <>
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-12">
        <div className="max-w-2xl mx-auto">

          <Link
            href={`/post/${params.slug}`}
            className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted hover:text-ink transition-colors mb-8 inline-block"
          >
            ← Voltar ao artigo
          </Link>

          <p className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted mb-3">
            Carrosséis para LinkedIn · {carousels.length} variações
          </p>

          <h1 className="font-syne font-bold text-ink text-2xl md:text-3xl leading-tight mb-10 border-b border-warm-gray pb-6 tracking-tight">
            {title}
          </h1>

          <CarouselViewer carousels={carousels} />

          <div className="border-t border-warm-gray pt-8 mt-10 flex flex-wrap gap-6">
            <Link
              href={`/resumo/${params.slug}`}
              className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-ink hover:text-muted transition-colors"
            >
              Ver Briefing →
            </Link>
            <Link
              href={`/slides/${params.slug}`}
              className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-ink hover:text-muted transition-colors"
            >
              Ver Slides →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
