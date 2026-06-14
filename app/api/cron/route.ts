import { NextResponse } from 'next/server';
import { fetchTopicClusters, TopicCluster } from '@/lib/news-fetcher';
import {
  generateArticle,
  generatePrivateSummary,
  generateSlides,
  generateCarousels,
} from '@/lib/ai-generator';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getSortedArticlesData } from '@/lib/markdown';

export const dynamic = 'force-dynamic';

const TOPIC = 'Os principais destaques e inovações em Inteligência Artificial e Tecnologia hoje';

function toBrazilianISO(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const brt = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  return `${brt.getUTCFullYear()}-${pad(brt.getUTCMonth() + 1)}-${pad(brt.getUTCDate())}` +
    `T${pad(brt.getUTCHours())}:${pad(brt.getUTCMinutes())}:${pad(brt.getUTCSeconds())}-03:00`;
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function generateImage(articleTitle: string, fileName: string): Promise<string> {
  try {
    const imagePrompt = encodeURIComponent(
      `Abstract cinematic 3d render representing ${articleTitle}. Technology, mathematics, coding, physics, subtle glowing lines, dark modern background, highly detailed. No text.`
    );
    const imageResponse = await fetch(
      `https://image.pollinations.ai/prompt/${imagePrompt}?width=800&height=450&nologo=true`
    );
    if (!imageResponse.ok) throw new Error(`HTTP ${imageResponse.status}`);

    const buffer = await imageResponse.arrayBuffer();
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    ensureDir(imagesDir);
    fs.writeFileSync(path.join(imagesDir, `${fileName}.jpg`), Buffer.from(buffer));
    return `/images/${fileName}.jpg`;
  } catch {
    return `/images/tech_${Math.floor(Math.random() * 3) + 1}.png`;
  }
}

async function processCluster(
  cluster: TopicCluster,
  recentTitles: string[]
): Promise<{ fileName: string; title: string }> {
  const dateStr = new Date().toISOString().split('T')[0];
  const uniqueId = Math.random().toString(36).substring(2, 7);
  const fileName = `${dateStr}-${uniqueId}`;

  let markdownContent = await generateArticle(TOPIC, cluster.context, recentTitles);
  markdownContent = markdownContent.replace(/^```markdown\n/m, '').replace(/\n```$/m, '');

  const matterResult = matter(markdownContent);
  const articleTitle = matterResult.data.title || 'Inovação em Tecnologia e IA';
  matterResult.data.date = toBrazilianISO(new Date());
  matterResult.data.image = await generateImage(articleTitle, fileName);

  const finalMarkdown = matter.stringify(matterResult.content, matterResult.data);

  ensureDir(path.join(process.cwd(), 'content', 'articles'));
  fs.writeFileSync(path.join(process.cwd(), 'content', 'articles', `${fileName}.md`), finalMarkdown, 'utf-8');

  const summary = await generatePrivateSummary(finalMarkdown);
  ensureDir(path.join(process.cwd(), 'data', 'summaries'));
  fs.writeFileSync(
    path.join(process.cwd(), 'data', 'summaries', `${fileName}.json`),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );

  const slides = await generateSlides(finalMarkdown, articleTitle);
  ensureDir(path.join(process.cwd(), 'data', 'slides'));
  fs.writeFileSync(
    path.join(process.cwd(), 'data', 'slides', `${fileName}.json`),
    JSON.stringify(slides, null, 2),
    'utf-8'
  );

  const carousels = await generateCarousels(finalMarkdown, articleTitle);
  ensureDir(path.join(process.cwd(), 'data', 'carousels'));
  fs.writeFileSync(
    path.join(process.cwd(), 'data', 'carousels', `${fileName}.json`),
    JSON.stringify(carousels, null, 2),
    'utf-8'
  );

  return { fileName, title: articleTitle };
}

export async function GET(request: Request) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const authHeader = request.headers.get('authorization');

  if (!isDevelopment && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    console.log('[CRON] Buscando clusters de noticias...');
    const clusters = await fetchTopicClusters();

    if (clusters.length === 0) {
      return NextResponse.json({ success: true, message: 'Nenhuma noticia nova, ignorando.', generated: 0 });
    }

    console.log(`[CRON] ${clusters.length} cluster(s) encontrado(s).`);

    const recentArticles = getSortedArticlesData();
    const recentTitles = recentArticles.slice(0, 10).map(a => a.title);

    const generated: string[] = [];
    const allNewUrls: string[] = [];

    for (let i = 0; i < clusters.length; i++) {
      try {
        console.log(`[CRON] Processando cluster ${i + 1}/${clusters.length}...`);
        const { fileName, title } = await processCluster(clusters[i], recentTitles);
        generated.push(fileName);
        recentTitles.unshift(title);
        allNewUrls.push(...clusters[i].urls);
      } catch (err: any) {
        console.error(`[CRON] Erro no cluster ${i + 1}:`, err?.message);
      }
    }

    // Update history
    const historyPath = path.join(process.cwd(), 'data', 'history.json');
    ensureDir(path.join(process.cwd(), 'data'));
    let usedUrls: string[] = [];
    if (fs.existsSync(historyPath)) {
      usedUrls = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }
    usedUrls.push(...allNewUrls);
    fs.writeFileSync(historyPath, JSON.stringify(usedUrls, null, 2), 'utf8');

    console.log(`[CRON] Concluido. ${generated.length} artigo(s) gerado(s).`);
    return NextResponse.json({ success: true, generated: generated.length, files: generated });
  } catch (error: any) {
    console.error('[CRON] Erro fatal:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
