import fs from 'fs';
import path from 'path';

export type Summary = {
  tldr: string;
  key_facts: string[];
  why_it_matters: string;
  watch_next: string[];
  editorial_angle: string;
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

export function hasSummary(slug: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'data', 'summaries', `${slug}.json`));
}
