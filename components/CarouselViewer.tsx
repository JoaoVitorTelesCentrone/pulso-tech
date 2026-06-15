'use client';

import { useState } from 'react';
import type { Carousel, CarouselSlide, TemplateId } from '@/lib/content-data';

/* ─── Template tokens ──────────────────────────────────────── */
type TemplateTokens = {
  name: string;
  // Slide backgrounds
  bg1: string;   // cover, stat, list
  bg2: string;   // quote, content
  ctaBg: string; // cta slide
  // Text
  text1: string;    // on bg1
  text2: string;    // on bg2
  ctaText: string;  // on ctaBg
  // Accent (highlight number/electric color)
  accent: string;
  // Supporting
  meta: string;
  rule: string;
  decorLetter: string; // large watermark letter color on cover
};

const TEMPLATES: Record<TemplateId, TemplateTokens> = {
  A: {
    name: 'Manchete',
    bg1: '#0D0D0B', bg2: '#EDE8DC', ctaBg: '#C9FF47',
    text1: '#F4F0E8', text2: '#0D0D0B', ctaText: '#0D0D0B',
    accent: '#C9FF47',
    meta: '#7A7670', rule: '#C8C3B8', decorLetter: '#1A1A18',
  },
  B: {
    name: 'Impresso',
    bg1: '#F4F0E8', bg2: '#EDE8DC', ctaBg: '#0D0D0B',
    text1: '#0D0D0B', text2: '#0D0D0B', ctaText: '#F4F0E8',
    accent: '#0D0D0B',
    meta: '#7A7670', rule: '#C8C3B8', decorLetter: '#C8C3B8',
  },
  C: {
    name: 'Dados',
    bg1: '#0D0D0B', bg2: '#F4F0E8', ctaBg: '#0D0D0B',
    text1: '#F4F0E8', text2: '#0D0D0B', ctaText: '#C9FF47',
    accent: '#C9FF47',
    meta: '#7A7670', rule: '#C8C3B8', decorLetter: '#1A1A18',
  },
  D: {
    name: 'Âmbar',
    bg1: '#F5F0E8', bg2: '#EDE6D4', ctaBg: '#C26000',
    text1: '#1E0A00', text2: '#1E0A00', ctaText: '#F5F0E8',
    accent: '#C26000',
    meta: '#7A7670', rule: '#C26000', decorLetter: '#D4B896',
  },
  E: {
    name: 'Noite',
    bg1: '#080D1A', bg2: '#0F1830', ctaBg: '#4080FF',
    text1: '#C8D8FF', text2: '#C8D8FF', ctaText: '#080D1A',
    accent: '#4080FF',
    meta: '#7A7670', rule: '#0F1830', decorLetter: '#0D1525',
  },
  F: {
    name: 'Terra',
    bg1: '#1E110A', bg2: '#2A1810', ctaBg: '#D4920A',
    text1: '#F0E4C0', text2: '#F0E4C0', ctaText: '#1E110A',
    accent: '#D4920A',
    meta: '#D4920A', rule: '#D4920A', decorLetter: '#2A1810',
  },
};

const DEFAULT_TEMPLATE: TemplateId = 'A';

function resolveTemplate(id?: string): TemplateTokens {
  return TEMPLATES[(id as TemplateId) || DEFAULT_TEMPLATE] || TEMPLATES[DEFAULT_TEMPLATE];
}

/* ─── helpers ─────────────────────────────────────────── */
function pad(n: number, total: number) {
  return `${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

function decorativeLetter(text?: string) {
  return (text || 'A').replace(/[^a-zA-Z]/g, '').charAt(0).toUpperCase() || 'T';
}

function highlightHeadline(headline: string, word?: string, accent?: string) {
  if (!word) return <>{headline}</>;
  const parts = headline.split(new RegExp(`(${word})`, 'i'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === word.toLowerCase()
          ? <span key={i} style={{ color: accent }}>{part}</span>
          : part
      )}
    </>
  );
}

/* ─── Slide Number ────────────────────────────────────── */
function SlideNumber({ n, total, onDark, t }: { n: number; total: number; onDark: boolean; t: TemplateTokens }) {
  return (
    <div
      className="font-dm-mono absolute top-8 left-8 text-[0.65rem] tracking-[0.15em] select-none"
      style={{ color: onDark ? t.accent : t.meta }}
    >
      {pad(n, total)}
    </div>
  );
}

/* ─── Cover ────────────────────────────────────────────── */
function CoverSlide({ slide, n, total, t }: { slide: CarouselSlide; n: number; total: number; t: TemplateTokens }) {
  const isDark = t.bg1 === '#0D0D0B' || t.bg1.startsWith('#0') || t.bg1.startsWith('#1') || t.bg1.startsWith('#08');
  return (
    <div className="relative w-full aspect-square overflow-hidden flex flex-col justify-end p-8 md:p-10" style={{ background: t.bg1 }}>
      {/* Decorative letter */}
      <div className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden">
        <span className="font-syne font-extrabold leading-none" style={{ fontSize: '52%', color: t.decorLetter, letterSpacing: '-0.05em', lineHeight: 1, paddingLeft: '4%' }}>
          {decorativeLetter(slide.headline)}
        </span>
      </div>
      {/* Decorative circle */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: '55%', height: '55%', top: '-20%', right: '-15%', border: `1px solid ${t.accent}26` }} />

      <SlideNumber n={n} total={total} onDark={isDark} t={t} />

      <div className="relative mt-auto">
        {/* Template label chip */}
        <div className="mb-3">
          <span className="font-dm-mono text-[0.55rem] tracking-[0.18em] uppercase px-2 py-0.5" style={{ background: t.accent, color: isDark ? (t.ctaBg === t.bg1 ? t.text1 : t.ctaText) : t.ctaText }}>
            {t.name}
          </span>
        </div>
        <h2
          className="font-syne font-extrabold leading-[0.9] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(1.4rem, 6cqw, 2.4rem)', color: t.text1 }}
        >
          {slide.headline}
        </h2>
        {slide.subtext && (
          <p className="font-dm-mono mt-3 tracking-[0.08em]" style={{ fontSize: '0.65rem', color: t.meta }}>
            {slide.subtext}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Quote ─────────────────────────────────────────────── */
function QuoteSlide({ slide, n, total, t }: { slide: CarouselSlide; n: number; total: number; t: TemplateTokens }) {
  return (
    <div className="relative w-full aspect-square flex flex-col justify-center items-center p-10 md:p-12" style={{ background: t.bg2 }}>
      {/* Decorative opening mark */}
      <div className="absolute top-6 left-8 font-syne font-extrabold select-none pointer-events-none" style={{ fontSize: '8rem', color: t.rule, opacity: 0.22, lineHeight: 1 }}>&ldquo;</div>

      <SlideNumber n={n} total={total} onDark={false} t={t} />

      {/* Accent rule */}
      <div style={{ width: 32, height: 3, background: t.accent, marginBottom: 20 }} />

      <p
        className="font-cormorant italic text-center relative"
        style={{ fontSize: 'clamp(1.1rem, 4.5cqw, 1.7rem)', color: t.text2, lineHeight: 1.2, fontWeight: 300 }}
      >
        {slide.quote || slide.headline}
      </p>

      <p className="font-dm-mono absolute bottom-8 right-8 tracking-[0.1em] text-[0.55rem]" style={{ color: t.meta }}>
        Tech&amp;Future
      </p>
    </div>
  );
}

/* ─── Stat ───────────────────────────────────────────────── */
function StatSlide({ slide, n, total, t }: { slide: CarouselSlide; n: number; total: number; t: TemplateTokens }) {
  const isDark = t.bg1 === '#0D0D0B' || t.bg1.startsWith('#0') || t.bg1.startsWith('#1') || t.bg1.startsWith('#08');
  return (
    <div className="relative w-full aspect-square flex flex-col items-center justify-center p-8" style={{ background: t.bg1 }}>
      {/* Decorative line */}
      <div className="absolute" style={{ width: '30%', height: '1px', background: t.accent, opacity: 0.2, top: '30%' }} />

      <SlideNumber n={n} total={total} onDark={isDark} t={t} />

      <p
        className="font-syne font-extrabold leading-none tracking-[-0.04em]"
        style={{ fontSize: 'clamp(3.5rem, 18cqw, 7rem)', color: t.accent }}
      >
        {slide.stat_number || slide.headline}
      </p>
      {(slide.stat_label || slide.body) && (
        <p
          className="font-syne text-center mt-4"
          style={{ fontSize: 'clamp(0.8rem, 3cqw, 1.1rem)', color: t.text1, lineHeight: 1.35, fontWeight: 400, maxWidth: '70%' }}
        >
          {slide.stat_label || slide.body}
        </p>
      )}
    </div>
  );
}

/* ─── Content ────────────────────────────────────────────── */
function ContentSlide({ slide, n, total, t }: { slide: CarouselSlide; n: number; total: number; t: TemplateTokens }) {
  return (
    <div className="relative w-full aspect-square flex flex-col justify-center p-8 md:p-10 overflow-hidden" style={{ background: t.bg2 }}>
      {/* Watermark number */}
      {slide.topic_number && (
        <div
          className="absolute left-4 font-syne font-extrabold leading-none select-none pointer-events-none"
          style={{ fontSize: '45%', color: t.rule, opacity: 0.12, top: '50%', transform: 'translateY(-50%)' }}
        >
          {slide.topic_number}
        </div>
      )}

      <SlideNumber n={n} total={total} onDark={false} t={t} />

      {/* Accent top bar */}
      <div style={{ width: 40, height: 2, background: t.accent, marginBottom: 16 }} />

      <div className="relative">
        <h3
          className="font-syne font-bold leading-tight tracking-[-0.02em]"
          style={{ fontSize: 'clamp(1.1rem, 5cqw, 1.8rem)', color: t.text2 }}
        >
          {slide.headline}
        </h3>
        {slide.body && (
          <p
            className="font-cormorant mt-3"
            style={{ fontSize: 'clamp(0.9rem, 3.5cqw, 1.25rem)', color: t.meta, lineHeight: 1.5, fontWeight: 300 }}
          >
            {slide.body}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── List ───────────────────────────────────────────────── */
function ListSlide({ slide, n, total, t }: { slide: CarouselSlide; n: number; total: number; t: TemplateTokens }) {
  const items = slide.items || [];
  const isDark = t.bg1 === '#0D0D0B' || t.bg1.startsWith('#0') || t.bg1.startsWith('#1') || t.bg1.startsWith('#08');
  return (
    <div className="relative w-full aspect-square flex flex-col justify-center p-8 md:p-10" style={{ background: t.bg1 }}>
      <SlideNumber n={n} total={total} onDark={isDark} t={t} />

      {/* Rule */}
      <div style={{ width: '100%', height: 1, background: t.rule, opacity: 0.5, marginBottom: 16 }} />

      <h3
        className="font-syne font-bold leading-tight mb-6"
        style={{ fontSize: 'clamp(0.95rem, 4cqw, 1.4rem)', color: t.text1 }}
      >
        {slide.headline}
      </h3>

      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="font-dm-mono flex-shrink-0" style={{ color: t.accent, fontSize: '0.75rem', paddingTop: 1 }}>→</span>
            <span
              className="font-syne"
              style={{ fontSize: 'clamp(0.8rem, 3cqw, 1rem)', color: t.text1, lineHeight: 1.3 }}
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
function CTASlide({ slide, n, total, t }: { slide: CarouselSlide; n: number; total: number; t: TemplateTokens }) {
  return (
    <div className="relative w-full aspect-square flex flex-col justify-between p-8 md:p-10 overflow-hidden" style={{ background: t.ctaBg }}>
      {/* Decorative circle */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: '60%', height: '60%', bottom: '-20%', right: '-15%', border: `1px solid ${t.ctaText}26` }} />

      <SlideNumber n={n} total={total} onDark={false} t={t} />

      {/* Top rule */}
      <div style={{ width: '100%', height: 1, background: t.ctaText, opacity: 0.3, marginBottom: 12 }} />

      <div className="relative mt-auto">
        <h2
          className="font-syne font-bold leading-[0.95] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(1.3rem, 5.5cqw, 2rem)', color: t.ctaText }}
        >
          {highlightHeadline(slide.headline || '', slide.highlight_word, t.ctaText)}
        </h2>
        {slide.subtext && (
          <p
            className="font-cormorant italic mt-4"
            style={{ fontSize: 'clamp(0.85rem, 3cqw, 1.1rem)', color: t.ctaText, lineHeight: 1.4, fontWeight: 300, opacity: 0.8 }}
          >
            {slide.subtext}
          </p>
        )}
      </div>

      {/* Logo */}
      <div className="relative flex items-baseline justify-center mt-6">
        <span className="font-syne font-extrabold" style={{ fontSize: '1rem', letterSpacing: '-0.03em', color: t.ctaText }}>Tech</span>
        <span className="font-cormorant italic font-light" style={{ fontSize: '1.1rem', color: t.ctaText, padding: '0 0.1em', opacity: 0.7 }}>&amp;</span>
        <span className="font-syne font-extrabold" style={{ fontSize: '1rem', letterSpacing: '-0.03em', color: t.ctaText }}>Future</span>
      </div>
    </div>
  );
}

/* ─── Dispatcher ─────────────────────────────────────────── */
function SlideRenderer({ slide, n, total, t }: { slide: CarouselSlide; n: number; total: number; t: TemplateTokens }) {
  switch (slide.type) {
    case 'cover':   return <CoverSlide   slide={slide} n={n} total={total} t={t} />;
    case 'quote':   return <QuoteSlide   slide={slide} n={n} total={total} t={t} />;
    case 'stat':    return <StatSlide    slide={slide} n={n} total={total} t={t} />;
    case 'content': return <ContentSlide slide={slide} n={n} total={total} t={t} />;
    case 'list':    return <ListSlide    slide={slide} n={n} total={total} t={t} />;
    case 'cta':     return <CTASlide     slide={slide} n={n} total={total} t={t} />;
    default:        return <ContentSlide slide={slide} n={n} total={total} t={t} />;
  }
}

function slideBg(slide: CarouselSlide, t: TemplateTokens): string {
  if (slide.type === 'cta') return t.ctaBg;
  if (slide.type === 'quote' || slide.type === 'content') return t.bg2;
  return t.bg1;
}

/* ─── Main viewer ────────────────────────────────────────── */
export default function CarouselViewer({ carousels }: { carousels: Carousel[] }) {
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!carousels || carousels.length === 0) {
    return <p className="font-cormorant text-muted text-lg">Nenhum carrossel disponível.</p>;
  }

  const carousel = carousels[activeCarousel];
  const t = resolveTemplate(carousel?.template);
  const slides = carousel?.slides || [];
  const total  = slides.length;

  const handleCarouselChange = (i: number) => { setActiveCarousel(i); setCurrentSlide(0); };

  return (
    <div className="w-full">

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {carousels.map((c, i) => {
          const ct = resolveTemplate(c.template);
          const isActive = i === activeCarousel;
          return (
            <button
              key={i}
              onClick={() => handleCarouselChange(i)}
              className="text-left p-3 border transition-colors"
              style={{
                borderColor: isActive ? ct.accent : '#C8C3B8',
                background: isActive ? ct.bg1 : '#EDE8DC',
                color: isActive ? ct.text1 : '#7A7670',
              }}
            >
              <span className="font-dm-mono text-[0.55rem] uppercase tracking-[0.15em] block mb-1" style={{ color: isActive ? ct.accent : '#7A7670', opacity: isActive ? 1 : 0.6 }}>
                {ct.name} · Carrossel {c.carousel_id}
              </span>
              <span className="font-cormorant text-sm leading-snug line-clamp-2" style={{ fontWeight: 300 }}>
                {c.angle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active angle label */}
      <p className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase mb-6" style={{ color: t.meta }}>
        Ângulo: {carousel.angle} · Template {carousel.template || 'A'} — {t.name}
      </p>

      {/* Slide preview */}
      <div className="max-w-sm mx-auto" style={{ containerType: 'inline-size' }}>
        {slides[currentSlide] && (
          <SlideRenderer slide={slides[currentSlide]} n={currentSlide + 1} total={total} t={t} />
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
                style={{ background: i === currentSlide ? t.accent : t.rule }}
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
            const bg = slideBg(slide, t);
            const isActive = i === currentSlide;
            const onDark = bg === t.bg1 && (t.bg1 !== '#F4F0E8' && t.bg1 !== '#F5F0E8');
            return (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="aspect-square flex flex-col items-start justify-end p-2 relative overflow-hidden transition-opacity"
                style={{
                  background: bg,
                  outline: isActive ? `2px solid ${t.accent}` : 'none',
                  outlineOffset: '2px',
                  opacity: isActive ? 1 : 0.75,
                }}
              >
                <span className="font-dm-mono text-[0.45rem] block mb-0.5" style={{ color: onDark ? t.accent : t.meta }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="font-syne leading-tight line-clamp-2 text-left"
                  style={{ fontSize: '0.5rem', color: onDark ? t.text1 : t.text2, fontWeight: 600 }}
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
