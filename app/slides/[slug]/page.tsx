import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SlidesViewer from '@/components/SlidesViewer';
import { getSlideDeck } from '@/lib/content-data';
import { getSortedArticlesData } from '@/lib/markdown';

export default function SlidesPage({ params }: { params: { slug: string } }) {
  const deck = getSlideDeck(params.slug);
  if (!deck) notFound();

  const articles = getSortedArticlesData();
  const article = articles.find(a => a.slug === params.slug);
  const title = article?.title || deck.title || params.slug;

  return (
    <>
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-12">
        <div className="max-w-4xl mx-auto">

          <Link href={`/post/${params.slug}`} className="font-label-caps text-label-caps uppercase text-primary hover:underline mb-8 inline-block">
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

          <SlidesViewer deck={deck} />

          <div className="border-t border-primary pt-8 mt-8 flex flex-wrap gap-4" style={{ borderTopWidth: '0.5pt' }}>
            <Link href={`/resumo/${params.slug}`} className="font-label-caps text-[10px] uppercase tracking-widest text-primary hover:text-accent-coral transition-colors">
              Ver Briefing →
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
