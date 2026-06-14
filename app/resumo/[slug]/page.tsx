import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSummary } from '@/lib/content-data';
import { getSortedArticlesData } from '@/lib/markdown';

export default function ResumoPage({ params }: { params: { slug: string } }) {
  const summary = getSummary(params.slug);
  if (!summary) notFound();

  const articles = getSortedArticlesData();
  const article = articles.find(a => a.slug === params.slug);
  const title = article?.title || params.slug;

  return (
    <>
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-12">
        <div className="max-w-3xl mx-auto">

          <Link href={`/post/${params.slug}`} className="font-label-caps text-label-caps uppercase text-primary hover:underline mb-8 inline-block">
            ← Voltar ao artigo
          </Link>

          <div className="mb-2">
            <span className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-widest">Briefing Editorial</span>
          </div>
          <h1 className="font-newsreader font-semibold text-primary text-3xl md:text-4xl leading-tight mb-10 border-b border-primary pb-6" style={{ borderBottomWidth: '0.5pt' }}>
            {title}
          </h1>

          {/* TLDR */}
          <div className="bg-primary-container text-on-primary p-8 mb-10">
            <p className="font-label-caps text-[10px] uppercase tracking-widest text-on-primary-container mb-3">TL;DR</p>
            <p className="font-newsreader text-xl md:text-2xl text-on-primary leading-relaxed">
              {summary.tldr}
            </p>
          </div>

          {/* Key Facts */}
          {summary.key_facts?.length > 0 && (
            <section className="mb-10">
              <h2 className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant mb-5">Fatos-Chave</h2>
              <ol className="space-y-4">
                {summary.key_facts.map((fact, i) => (
                  <li key={i} className="flex gap-5 items-start">
                    <span className="font-newsreader text-2xl font-semibold text-accent-coral leading-none mt-1 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-work-sans text-body-md text-on-surface leading-relaxed">{fact}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="border-t border-primary mb-10" style={{ borderTopWidth: '0.5pt' }} />

          {/* Why it matters */}
          {summary.why_it_matters && (
            <section className="mb-10">
              <h2 className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Por que importa</h2>
              <p className="font-work-sans text-body-md text-on-surface leading-relaxed">{summary.why_it_matters}</p>
            </section>
          )}

          {/* Watch next */}
          {summary.watch_next?.length > 0 && (
            <section className="mb-10">
              <h2 className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Fique de olho</h2>
              <ul className="space-y-2">
                {summary.watch_next.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start font-work-sans text-body-md text-on-surface">
                    <span className="text-accent-coral mt-1 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Editorial angle */}
          {summary.editorial_angle && (
            <section className="mb-10 bg-surface-container-low p-6">
              <h2 className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Ângulo editorial</h2>
              <p className="font-work-sans text-body-md text-on-surface leading-relaxed italic">{summary.editorial_angle}</p>
            </section>
          )}

          <div className="border-t border-primary pt-8 flex flex-wrap gap-4" style={{ borderTopWidth: '0.5pt' }}>
            <Link href={`/slides/${params.slug}`} className="font-label-caps text-[10px] uppercase tracking-widest text-primary hover:text-accent-coral transition-colors">
              Ver Slides →
            </Link>
            <Link href={`/carousel/${params.slug}`} className="font-label-caps text-[10px] uppercase tracking-widest text-primary hover:text-accent-coral transition-colors">
              Ver Carrossel →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
