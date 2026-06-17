import { getArticleData } from '@/lib/markdown'
import { getSummary } from '@/lib/content-data'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CardPage({ params }: { params: { slug: string } }) {
  const article = await getArticleData(params.slug).catch(() => null)
  if (!article) notFound()

  const summary = getSummary(params.slug)
  const date = new Date(article.date).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo',
  })

  return (
    <div className="min-h-screen bg-[#0D0D0B] flex flex-col items-center justify-center p-6">

      {/* Card */}
      <div
        className="w-full max-w-[480px] aspect-[4/5] bg-[#0D0D0B] border border-white/10 flex flex-col relative overflow-hidden"
        id="card"
      >
        {/* Top accent */}
        <div className="h-[3px] bg-[#FF3D00] w-full flex-shrink-0" />

        {/* Inner padding */}
        <div className="flex flex-col flex-1 p-8 gap-0">

          {/* Header */}
          <div className="flex items-center justify-between mb-auto">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FF3D00]" />
              <span className="font-syne font-extrabold text-white text-sm tracking-[-0.03em]">Pulso</span>
            </div>
            <span className="font-dm-mono text-[0.5rem] tracking-[0.15em] uppercase text-white/30">{date}</span>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5 mt-8">
              {article.tags.slice(0, 3).map(tag => (
                <span key={tag} className="font-dm-mono text-[0.48rem] tracking-[0.12em] uppercase text-[#FF3D00] border border-[#FF3D00]/40 px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-syne font-extrabold text-white leading-[1.0] tracking-[-0.04em] text-[1.65rem] mb-6">
            {article.title}
          </h1>

          {/* TL;DR */}
          {summary?.tldr && (
            <p className="font-cormorant font-light text-white/60 text-base leading-relaxed mb-auto">
              {summary.tldr}
            </p>
          )}

          {/* Key fact highlight */}
          {summary?.key_facts?.[0] && (
            <div className="border-l-2 border-[#FF3D00] pl-4 mt-6 mb-6">
              <p className="font-cormorant font-light text-white/80 text-sm leading-relaxed italic">
                {summary.key_facts[0]}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
            <span className="font-dm-mono text-[0.48rem] tracking-[0.15em] uppercase text-white/30">
              Leia a analise completa
            </span>
            <span className="font-dm-mono text-[0.48rem] tracking-[0.15em] uppercase text-white/30">
              pulso.news
            </span>
          </div>

        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center max-w-xs">
        <p className="font-dm-mono text-[0.6rem] tracking-[0.12em] uppercase text-white/30 mb-4">
          Tire um print para compartilhar
        </p>
        <Link
          href={`/post/${params.slug}`}
          className="font-dm-mono text-[0.6rem] tracking-[0.12em] uppercase text-white/50 hover:text-white transition-colors border-b border-white/20 pb-0.5"
        >
          Ler artigo completo
        </Link>
      </div>

    </div>
  )
}
