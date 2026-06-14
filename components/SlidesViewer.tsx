'use client';

import { useState } from 'react';
import type { SlideDeck, Slide } from '@/lib/content-data';

function SlideCard({ slide, index, total }: { slide: Slide; index: number; total: number }) {
  const isCover = slide.type === 'cover';
  const isCta = slide.type === 'cta';
  const isDark = isCover || isCta;

  return (
    <div
      className={`w-full aspect-[16/9] flex flex-col justify-between p-10 md:p-14 ${
        isDark ? 'bg-primary-container text-on-primary' : 'bg-surface-container-low text-on-surface'
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="font-label-caps text-[10px] uppercase tracking-widest opacity-50">
          {slide.type}
        </span>
        <span className="font-label-caps text-[10px] uppercase tracking-widest opacity-50">
          {index + 1} / {total}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center py-6">
        {(slide.headline || slide.heading) && (
          <h2 className={`font-newsreader font-semibold leading-tight mb-4 ${
            isCover ? 'text-3xl md:text-5xl text-on-primary' : 'text-2xl md:text-4xl'
          }`}>
            {slide.headline || slide.heading}
          </h2>
        )}

        {slide.subtext && (
          <p className="font-work-sans text-body-md opacity-75 mt-2">{slide.subtext}</p>
        )}

        {slide.body && (
          <p className="font-work-sans text-body-md leading-relaxed mt-2">{slide.body}</p>
        )}

        {slide.highlight && (
          <div className="mt-4 border-l-2 border-accent-coral pl-4">
            <p className="font-newsreader text-xl italic">{slide.highlight}</p>
          </div>
        )}

        {slide.bullets && slide.bullets.length > 0 && (
          <ul className="mt-4 space-y-3">
            {slide.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 items-start font-work-sans text-body-md">
                <span className="text-accent-coral shrink-0 mt-1">—</span>
                {b}
              </li>
            ))}
          </ul>
        )}

        {slide.visual_hint && (
          <p className="font-label-caps text-[10px] uppercase tracking-widest opacity-40 mt-6">
            Visual: {slide.visual_hint}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SlidesViewer({ deck }: { deck: SlideDeck }) {
  const [current, setCurrent] = useState(0);
  const slides = deck.slides || [];
  const total = slides.length;

  if (total === 0) {
    return <p className="font-work-sans text-on-surface-variant">Nenhum slide disponível.</p>;
  }

  return (
    <div className="w-full">
      <SlideCard slide={slides[current]} index={current} total={total} />

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
          className="font-label-caps text-[10px] uppercase tracking-widest text-primary disabled:opacity-30 hover:text-accent-coral transition-colors"
        >
          ← Anterior
        </button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? 'bg-primary' : 'bg-outline-variant'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrent(c => Math.min(total - 1, c + 1))}
          disabled={current === total - 1}
          className="font-label-caps text-[10px] uppercase tracking-widest text-primary disabled:opacity-30 hover:text-accent-coral transition-colors"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}
