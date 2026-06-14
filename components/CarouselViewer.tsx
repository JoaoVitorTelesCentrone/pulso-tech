'use client';

import { useState } from 'react';
import type { Carousel, CarouselSlide } from '@/lib/content-data';

/* ─── helpers ─────────────────────────────────────────── */
function pad(n: number, total: number) {
  return `${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

function decorativeLetter(text?: string) {
  return (text || 'A').replace(/[^a-zA-Z]/g, '').charAt(0).toUpperCase() || 'T';
}

function highlightHeadline(headline: string, word?: string) {
  if (!word) return <>{headline}</>;
  const parts = headline.split(new RegExp(`(${word})`, 'i'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === word.toLowerCase()
          ? <span key={i} style={{ color: '#C9FF47' }}>{part}</span>
          : part
      )}
    </>
  );
}

/* ─── slide backgrounds ────────────────────────────────── */
const INK   = '#0D0D0B';
const PAPER = '#EDE8DC';
const CREAM = '#F4F0E8';
const ELECTRIC = '#C9FF47';
const WARM_GRAY = '#C8C3B8';
const MUTED = '#7A7670';

function slideBackground(type: string, n: number): string {
  if (['cover', 'stat', 'list', 'cta'].includes(type)) return INK;
  if (type === 'quote' || type === 'content') return PAPER;
  // fallback: alternate
  return n % 2 === 1 ? INK : PAPER;
}

/* ─── Numeração ────────────────────────────────────────── */
function SlideNumber({ n, total, dark }: { n: number; total: number; dark: boolean }) {
  return (
    <div
      className="font-dm-mono absolute top-8 left-8 text-[0.65rem] tracking-[0.15em] select-none"
      style={{ color: dark ? ELECTRIC : INK }}
    >
      {pad(n, total)}
    </div>
  );
}

/* ─── Cover ────────────────────────────────────────────── */
function CoverSlide({ slide, n, total }: { slide: CarouselSlide; n: number; total: number }) {
  return (
    <div className="relative w-full aspect-square overflow-hidden flex flex-col justify-end p-8 md:p-10" style={{ background: INK }}>
      {/* Decorative letter */}
      <div className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden">
        <span className="font-syne font-extrabold leading-none" style={{ fontSize: '52%', color: '#1A1A18', letterSpacing: '-0.05em', lineHeight: 1, paddingLeft: '4%' }}>
          {decorativeLetter(slide.headline)}
        </span>
      </div>
      {/* Decorative circle */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: '55%', height: '55%', top: '-20%', right: '-15%', border: `1px solid rgba(201,255,71,0.12)` }} />

      <SlideNumber n={n} total={total} dark />

      <div className="relative mt-auto">
        <h2
          className="font-syne font-extrabold text-white leading-[0.9] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(1.4rem, 6cqw, 2.4rem)' }}
        >
          {slide.headline}
        </h2>
        {slide.subtext && (
          <p className="font-dm-mono mt-3 tracking-[0.08em]" style={{ fontSize: '0.65rem', color: WARM_GRAY }}>
            {slide.subtext}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Quote ─────────────────────────────────────────────── */
function QuoteSlide({ slide, n, total }: { slide: CarouselSlide; n: number; total: number }) {
  return (
    <div className="relative w-full aspect-square flex flex-col justify-center items-center p-10 md:p-12" style={{ background: PAPER }}>
      {/* Decorative quotes */}
      <div className="absolute top-6 left-8 font-syne font-extrabold select-none pointer-events-none" style={{ fontSize: '8rem', color: WARM_GRAY, opacity: 0.18, lineHeight: 1 }}>&ldquo;</div>

      <SlideNumber n={n} total={total} dark={false} />

      <p
        className="font-cormorant italic text-center relative"
        style={{ fontSize: 'clamp(1.1rem, 4.5cqw, 1.7rem)', color: INK, lineHeight: 1.2, fontWeight: 300 }}
      >
        {slide.quote || slide.headline}
      </p>

      {/* Logo */}
      <p className="font-dm-mono absolute bottom-8 right-8 tracking-[0.1em] text-[0.55rem]" style={{ color: MUTED }}>
        Tech&amp;Future
      </p>
    </div>
  );
}

/* ─── Stat ───────────────────────────────────────────────── */
function StatSlide({ slide, n, total }: { slide: CarouselSlide; n: number; total: number }) {
  return (
    <div className="relative w-full aspect-square flex flex-col items-center justify-center p-8" style={{ background: INK }}>
      {/* Decorative line */}
      <div className="absolute" style={{ width: '30%', height: '1px', background: `rgba(201,255,71,0.15)`, top: '30%' }} />

      <SlideNumber n={n} total={total} dark />

      <p
        className="font-syne font-extrabold leading-none tracking-[-0.04em]"
        style={{ fontSize: 'clamp(3.5rem, 18cqw, 7rem)', color: ELECTRIC }}
      >
        {slide.stat_number || slide.headline}
      </p>
      {(slide.stat_label || slide.body) && (
        <p
          className="font-syne text-center mt-4"
          style={{ fontSize: 'clamp(0.8rem, 3cqw, 1.1rem)', color: CREAM, lineHeight: 1.35, fontWeight: 400, maxWidth: '70%' }}
        >
          {slide.stat_label || slide.body}
        </p>
      )}
    </div>
  );
}

/* ─── Content ────────────────────────────────────────────── */
function ContentSlide({ slide, n, total }: { slide: CarouselSlide; n: number; total: number }) {
  return (
    <div className="relative w-full aspect-square flex flex-col justify-center p-8 md:p-10 overflow-hidden" style={{ background: PAPER }}>
      {/* Watermark number */}
      {slide.topic_number && (
        <div
          className="absolute left-4 font-syne font-extrabold leading-none select-none pointer-events-none"
          style={{ fontSize: '45%', color: WARM_GRAY, opacity: 0.12, top: '50%', transform: 'translateY(-50%)' }}
        >
          {slide.topic_number}
        </div>
      )}

      <SlideNumber n={n} total={total} dark={false} />

      <div className="relative">
        <h3
          className="font-syne font-bold leading-tight tracking-[-0.02em]"
          style={{ fontSize: 'clamp(1.1rem, 5cqw, 1.8rem)', color: INK }}
        >
          {slide.headline}
        </h3>
        {slide.body && (
          <p
            className="font-cormorant mt-3"
            style={{ fontSize: 'clamp(0.9rem, 3.5cqw, 1.25rem)', color: MUTED, lineHeight: 1.5, fontWeight: 300 }}
          >
            {slide.body}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── List ───────────────────────────────────────────────── */
function ListSlide({ slide, n, total }: { slide: CarouselSlide; n: number; total: number }) {
  const items = slide.items || [];
  return (
    <div className="relative w-full aspect-square flex flex-col justify-center p-8 md:p-10" style={{ background: INK }}>
      <SlideNumber n={n} total={total} dark />

      <h3
        className="font-syne font-bold leading-tight mb-6"
        style={{ fontSize: 'clamp(0.95rem, 4cqw, 1.4rem)', color: CREAM }}
      >
        {slide.headline}
      </h3>

      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="font-syne font-bold flex-shrink-0" style={{ color: ELECTRIC, fontSize: '0.85rem' }}>◆</span>
            <span
              className="font-syne"
              style={{ fontSize: 'clamp(0.8rem, 3cqw, 1rem)', color: CREAM, lineHeight: 1.3 }}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── CTA ────────────────────────────────────────────────── */
function CTASlide({ slide, n, total }: { slide: CarouselSlide; n: number; total: number }) {
  return (
    <div className="relative w-full aspect-square flex flex-col justify-between p-8 md:p-10 overflow-hidden" style={{ background: INK }}>
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(201,255,71,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,255,71,0.04) 1px, transparent 1px)`,
        backgroundSize: '25% 25%',
      }} />
      {/* Decorative circle */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: '60%', height: '60%', bottom: '-20%', right: '-15%', border: `1px solid rgba(201,255,71,0.08)` }} />

      <SlideNumber n={n} total={total} dark />

      <div className="relative mt-auto">
        <h2
          className="font-syne font-bold leading-[0.95] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(1.3rem, 5.5cqw, 2rem)', color: CREAM }}
        >
          {highlightHeadline(slide.headline || '', slide.highlight_word)}
        </h2>
        {slide.subtext && (
          <p
            className="font-cormorant italic mt-4"
            style={{ fontSize: 'clamp(0.85rem, 3cqw, 1.1rem)', color: WARM_GRAY, lineHeight: 1.4, fontWeight: 300 }}
          >
            {slide.subtext}
          </p>
        )}
      </div>

      {/* Logo */}
      <div className="relative flex items-baseline justify-center mt-6">
        <span className="font-syne font-extrabold text-white" style={{ fontSize: '1rem', letterSpacing: '-0.03em' }}>Tech</span>
        <span className="font-cormorant italic font-light" style={{ fontSize: '1.1rem', color: ELECTRIC, padding: '0 0.1em' }}>&amp;</span>
        <span className="font-syne font-extrabold text-white" style={{ fontSize: '1rem', letterSpacing: '-0.03em' }}>Future</span>
      </div>
    </div>
  );
}

/* ─── Dispatcher ─────────────────────────────────────────── */
function SlideRenderer({ slide, n, total }: { slide: CarouselSlide; n: number; total: number }) {
  switch (slide.type) {
    case 'cover':   return <CoverSlide   slide={slide} n={n} total={total} />;
    case 'quote':   return <QuoteSlide   slide={slide} n={n} total={total} />;
    case 'stat':    return <StatSlide    slide={slide} n={n} total={total} />;
    case 'content': return <ContentSlide slide={slide} n={n} total={total} />;
    case 'list':    return <ListSlide    slide={slide} n={n} total={total} />;
    case 'cta':     return <CTASlide     slide={slide} n={n} total={total} />;
    default:        return <ContentSlide slide={slide} n={n} total={total} />;
  }
}

/* ─── Main viewer ────────────────────────────────────────── */
export default function CarouselViewer({ carousels }: { carousels: Carousel[] }) {
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!carousels || carousels.length === 0) {
    return <p className="font-cormorant text-muted text-lg">Nenhum carrossel disponível.</p>;
  }

  const carousel = carousels[activeCarousel];
  const slides   = carousel?.slides || [];
  const total    = slides.length;

  const handleCarouselChange = (i: number) => { setActiveCarousel(i); setCurrentSlide(0); };

  return (
    <div className="w-full">

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {carousels.map((c, i) => (
          <button
            key={i}
            onClick={() => handleCarouselChange(i)}
            className="text-left p-3 border transition-colors"
            style={{
              borderColor: i === activeCarousel ? INK : WARM_GRAY,
              background: i === activeCarousel ? INK : PAPER,
              color: i === activeCarousel ? CREAM : MUTED,
            }}
          >
            <span className="font-dm-mono text-[0.55rem] uppercase tracking-[0.15em] block mb-1 opacity-60">
              Carrossel {c.carousel_id}
            </span>
            <span className="font-cormorant text-sm leading-snug line-clamp-2" style={{ fontWeight: 300 }}>
              {c.angle}
            </span>
          </button>
        ))}
      </div>

      {/* Active angle label */}
      <p className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted mb-6">
        Ângulo: {carousel.angle}
      </p>

      {/* Slide preview */}
      <div className="max-w-sm mx-auto" style={{ containerType: 'inline-size' }}>
        {slides[currentSlide] && (
          <SlideRenderer slide={slides[currentSlide]} n={currentSlide + 1} total={total} />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setCurrentSlide(c => Math.max(0, c - 1))}
            disabled={currentSlide === 0}
            className="font-dm-mono text-[0.65rem] tracking-[0.12em] uppercase text-ink disabled:opacity-20 hover:text-muted transition-colors"
          >
            ← Ant
          </button>

          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{ background: i === currentSlide ? INK : WARM_GRAY }}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(c => Math.min(total - 1, c + 1))}
            disabled={currentSlide === total - 1}
            className="font-dm-mono text-[0.65rem] tracking-[0.12em] uppercase text-ink disabled:opacity-20 hover:text-muted transition-colors"
          >
            Prox →
          </button>
        </div>
      </div>

      {/* Strip */}
      <div className="mt-10">
        <p className="font-dm-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted mb-4">Todos os slides</p>
        <div className="grid grid-cols-5 gap-1.5">
          {slides.map((slide, i) => {
            const bg = slideBackground(slide.type, i + 1);
            const isActive = i === currentSlide;
            return (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="aspect-square flex flex-col items-start justify-end p-2 relative overflow-hidden transition-opacity"
                style={{
                  background: bg,
                  outline: isActive ? `2px solid ${INK}` : 'none',
                  outlineOffset: '2px',
                  opacity: isActive ? 1 : 0.75,
                }}
              >
                <span className="font-dm-mono text-[0.45rem] block mb-0.5" style={{ color: bg === INK ? ELECTRIC : MUTED }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="font-syne leading-tight line-clamp-2 text-left"
                  style={{ fontSize: '0.5rem', color: bg === INK ? CREAM : INK, fontWeight: 600 }}
                >
                  {slide.headline || slide.quote || slide.stat_number || '—'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
