import { NextResponse } from 'next/server';
import { generateCarousels } from '@/lib/ai-generator';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Parâmetro ?slug= obrigatório' }, { status: 400 });
  }

  const articlePath = path.join(process.cwd(), 'content', 'articles', `${slug}.md`);
  if (!fs.existsSync(articlePath)) {
    return NextResponse.json({ error: `Artigo não encontrado: ${slug}` }, { status: 404 });
  }

  const raw = fs.readFileSync(articlePath, 'utf-8');
  const { data } = matter(raw);
  const articleTitle = data.title || slug;

  console.log(`[REGEN] Regenerando carrosséis para: ${articleTitle}`);

  const carousels = await generateCarousels(raw, articleTitle);

  const outPath = path.join(process.cwd(), 'data', 'carousels', `${slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(carousels, null, 2), 'utf-8');

  return NextResponse.json({ ok: true, slug, title: articleTitle, carousels });
}
