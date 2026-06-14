import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getArticleData } from '@/lib/markdown'
import { hasContent } from '@/lib/content-data'
import Link from 'next/link'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const article = await getArticleData(params.slug)
  const content = hasContent(params.slug)

  const extraLinks = [
    content.summary  && { href: `/resumo/${params.slug}`,   label: 'Briefing Editorial' },
    content.slides   && { href: `/slides/${params.slug}`,   label: 'Slides' },
    content.carousels && { href: `/carousel/${params.slug}`, label: 'Carrossel' },
  ].filter(Boolean) as { href: string; label: string }[]

  return (
    <>
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-12">
        <article className="max-w-3xl mx-auto">

          <Link
            href="/"
            className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted hover:text-ink transition-colors mb-8 inline-block"
          >
            ← Voltar para o Início
          </Link>

          <header className="mb-12 border-b border-warm-gray pb-8">
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="font-dm-mono text-[0.6rem] tracking-[0.15em] uppercase px-3 py-1 border border-warm-gray text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-syne font-extrabold text-ink mb-6 leading-[0.95] tracking-[-0.03em] text-4xl md:text-5xl">
              {article.title}
            </h1>

            <p className="font-dm-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-8">
              Publicado em: {article.date}
            </p>

            {article.image && (
              <div className="w-full aspect-[21/9] relative mb-8 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            )}

            {extraLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {extraLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-dm-mono text-[0.65rem] tracking-[0.12em] uppercase border border-ink px-5 py-2 text-ink hover:bg-ink hover:text-white transition-colors duration-200"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div
            className="prose prose-lg max-w-none
                       prose-headings:font-syne prose-headings:font-bold prose-headings:tracking-tight
                       prose-p:font-cormorant prose-p:font-light prose-p:text-[1.15rem] prose-p:leading-[1.85]
                       prose-a:text-ink prose-a:underline hover:prose-a:no-underline
                       prose-strong:font-cormorant prose-strong:font-semibold
                       prose-blockquote:font-cormorant prose-blockquote:italic prose-blockquote:border-l-2 prose-blockquote:border-warm-gray prose-blockquote:text-muted
                       prose-code:font-dm-mono prose-code:text-sm prose-code:bg-paper prose-code:px-1"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        </article>
      </main>
      <Footer />
    </>
  )
}
