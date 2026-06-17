import Footer from '@/components/Footer'
import { getArticleData } from '@/lib/markdown'
import { hasSummary } from '@/lib/content-data'
import { PremiumCTA } from '@/components/PremiumCTA'
import { ArticleGate } from '@/components/ArticleGate'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { verifyAccessToken, ACCESS_COOKIE } from '@/lib/auth'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const article = await getArticleData(params.slug)
  const cookieStore = cookies()
  const token = cookieStore.get(ACCESS_COOKIE.name)?.value
  const access = token ? await verifyAccessToken(token) : null
  const isPremium = access?.plan === 'premium'

  const { contentHtml, premiumHtml, hasPremiumSplit } = article

  const extraLinks = [
    { href: `/card/${params.slug}`, label: 'Card' },
    hasSummary(params.slug) && { href: `/resumo/${params.slug}`, label: 'Briefing' },
  ].filter(Boolean) as { href: string; label: string }[]

  return (
    <>
      <main className="mx-auto w-full max-w-editorial px-5 py-10 md:px-grid-margin md:py-14">
        <article className="mx-auto max-w-4xl">
          <Link href="/" className="mb-8 inline-block font-body text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-faint transition-colors hover:text-accent">
            Voltar para o inicio
          </Link>

          <header className="mb-10 border-b border-border pb-10">
            <div className="mb-5 flex flex-wrap gap-2">
              {article.tags?.map(tag => (
                <span key={tag} className="tag-brand">{tag}</span>
              ))}
            </div>

            <p className="brand-kicker mb-5">analise / pulso tech</p>
            <h1 className="brand-poster max-w-5xl text-5xl md:text-7xl">
              {article.title}
            </h1>
            <p className="mt-6 font-display text-lg italic text-muted">
              Publicado em {article.date}
            </p>

            {article.image && (
              <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full max-h-[460px] w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                />
              </div>
            )}

            {extraLinks.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {extraLinks.map(link => (
                  <Link key={link.href} href={link.href} className="btn-soft">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div
            className="prose prose-lg max-w-none
              prose-headings:font-display prose-headings:italic prose-headings:font-semibold prose-headings:text-text
              prose-p:font-body prose-p:text-[1.05rem] prose-p:leading-[1.8] prose-p:text-text
              prose-a:text-accent prose-a:underline hover:prose-a:text-accent-hover
              prose-strong:font-bold prose-strong:text-text
              prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-surface prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:font-display prose-blockquote:italic prose-blockquote:text-muted
              prose-code:rounded-sm prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-body prose-code:text-sm
              prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-surface"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {!isPremium && hasPremiumSplit ? (
            <ArticleGate />
          ) : (
            <>
              {hasPremiumSplit && premiumHtml && (
                <div
                  className="prose prose-lg mt-10 max-w-none
                    prose-headings:font-display prose-headings:italic prose-headings:font-semibold prose-headings:text-text
                    prose-p:font-body prose-p:text-[1.05rem] prose-p:leading-[1.8] prose-p:text-text
                    prose-a:text-accent prose-a:underline hover:prose-a:text-accent-hover
                    prose-strong:font-bold prose-strong:text-text
                    prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-surface prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:font-display prose-blockquote:italic prose-blockquote:text-muted
                    prose-code:rounded-sm prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-body prose-code:text-sm
                    prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-surface"
                  dangerouslySetInnerHTML={{ __html: premiumHtml }}
                />
              )}
              <PremiumCTA />
            </>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
