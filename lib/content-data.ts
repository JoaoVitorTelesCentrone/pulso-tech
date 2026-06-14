import fs from 'fs';
import path from 'path';

export type Summary = {
  tldr: string;
  key_facts: string[];
  why_it_matters: string;
  watch_next: string[];
  editorial_angle: string;
};

export type Slide = {
  type: 'cover' | 'context' | 'insight' | 'data' | 'impact' | 'cta';
  headline?: string;
  heading?: string;
  subtext?: string;
  body?: string;
  bullets?: string[];
  highlight?: string;
  image_prompt?: string;
  visual_hint?: string;
};

export type SlideDeck = {
  title: string;
  theme: string;
  slides: Slide[];
};

export type CarouselSlide = {
  n: number;
  type: 'cover' | 'quote' | 'stat' | 'content' | 'list' | 'cta' | string;
  // cover / cta
  headline?: string;
  subtext?: string;
  // quote
  quote?: string;
  // stat
  stat_number?: string;
  stat_label?: string;
  // content
  topic_number?: string;
  body?: string;
  // list
  items?: string[];
  // cta
  highlight_word?: string;
};

export type Carousel = {
  carousel_id: number;
  angle: string;
  slides: CarouselSlide[];
};

function readJson<T>(dir: string, slug: string): T | null {
  const filePath = path.join(process.cwd(), 'data', dir, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return null;
  }
}

export function getSummary(slug: string): Summary | null {
  return readJson<Summary>('summaries', slug);
}

export function getSlideDeck(slug: string): SlideDeck | null {
  return readJson<SlideDeck>('slides', slug);
}

export function getCarousels(slug: string): Carousel[] | null {
  return readJson<Carousel[]>('carousels', slug);
}

export function hasContent(slug: string) {
  return {
    summary: fs.existsSync(path.join(process.cwd(), 'data', 'summaries', `${slug}.json`)),
    slides: fs.existsSync(path.join(process.cwd(), 'data', 'slides', `${slug}.json`)),
    carousels: fs.existsSync(path.join(process.cwd(), 'data', 'carousels', `${slug}.json`)),
  };
}
