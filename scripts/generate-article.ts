import { fetchTopicClusters } from '../lib/news-fetcher';
import {
  checkRelevanceWithKimi,
  generateArticle,
  generatePrivateSummary,
  generateSlides,
  reviewAndImprove,
} from '../lib/ai-generator';
import { buildImagePrompt, getNegativePrompt } from '../lib/image-prompts';
import { appendArticleToDailySummary, ArticleSummaryEntry } from '../lib/daily-summary';
import { notifySubscribersAboutNewArticle } from '../lib/article-notifications';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getSortedArticlesData } from '../lib/markdown';

const TOPIC = 'Os principais destaques e inovações em Inteligência Artificial e Tecnologia hoje';

const SEND_ARTICLE_EMAILS = process.env.SEND_ARTICLE_EMAILS === 'true';
const GENERATED_RUN_PATH = path.join(process.cwd(), 'data', 'generated-run.json');

const STOP_WORDS = new Set([
  'the', 'this', 'that', 'with', 'from', 'have', 'will', 'been',
  'como', 'para', 'com', 'uma', 'mais', 'into', 'about', 'your',
  'what', 'when', 'where', 'which', 'their', 'there', 'here',
  'just', 'more', 'than', 'over', 'after', 'before', 'could',
  'would', 'should', 'using', 'gets', 'says', 'also', 'its',
  'new', 'novo', 'nova', 'hoje', 'today', 'now', 'agora', 'says',
  'week', 'year', 'month', 'semana', 'anos', 'meses',
]);

function extractKeywords(text: string): Set<string> {
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !STOP_WORDS.has(w))
  );
}

function topicAlreadyCovered(
  cluster: { items: { title: string }[] },
  allTitles: string[]
): { covered: boolean; matchedTitle?: string } {
  const clusterText = cluster.items.map(i => i.title).join(' ');
  const clusterKeywords = extractKeywords(clusterText);

  for (const title of allTitles) {
    const titleKeywords = extractKeywords(title);
    const overlap = [...clusterKeywords].filter(w => titleKeywords.has(w)).length;
    if (overlap >= 3) {
      return { covered: true, matchedTitle: title };
    }
  }
  return { covered: false };
}

const genai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

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

async function generateImageWithGemini(
  articleTitle: string,
  tags: string[],
  fileName: string
): Promise<string> {
  const prompt = buildImagePrompt(articleTitle, tags);
  const imagesDirPath = path.join(process.cwd(), 'public', 'images');
  ensureDir(imagesDirPath);

  if (!genai) {
    console.warn('  GEMINI_API_KEY ausente, usando Pollinations para imagem...');
    return generateImageWithPollinations(articleTitle, fileName, imagesDirPath);
  }

  try {
    const response = await genai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) throw new Error('No image data in response');

    const imageBuffer = Buffer.from(imageBytes, 'base64');
    fs.writeFileSync(path.join(imagesDirPath, `${fileName}.jpg`), imageBuffer);
    return `/images/${fileName}.jpg`;
  } catch (err) {
    console.warn(`  Gemini image failed (${(err as Error).message}), falling back to Pollinations...`);
    return generateImageWithPollinations(articleTitle, fileName, imagesDirPath);
  }
}

async function generateImageWithPollinations(
  articleTitle: string,
  fileName: string,
  imagesDirPath: string
): Promise<string> {
  try {
    const prompt = buildImagePrompt(articleTitle, []);
    const encoded = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&nologo=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(path.join(imagesDirPath, `${fileName}.jpg`), Buffer.from(buffer));
    return `/images/${fileName}.jpg`;
  } catch {
    const n = Math.floor(Math.random() * 3) + 1;
    return `/images/tech_${n}.png`;
  }
}

async function processCluster(
  clusterIndex: number,
  totalClusters: number,
  cluster: { context: string; urls: string[] },
  recentTitles: string[],
  generatedEntries: ArticleSummaryEntry[]
): Promise<string | null> {
  console.log(`\n[${clusterIndex + 1}/${totalClusters}] Gerando artigo...`);

  const dateStr = new Date().toISOString().split('T')[0];
  const uniqueId = Math.random().toString(36).substring(2, 7);
  const fileName = `${dateStr}-${uniqueId}`;

  console.log(`[${clusterIndex + 1}/${totalClusters}] Checando relevancia com Kimi...`);
  const relevance = await checkRelevanceWithKimi(cluster.context, recentTitles);
  if (!relevance.approved) {
    console.log(`[${clusterIndex + 1}/${totalClusters}] Pulando por relevancia (${relevance.score}/100, ${relevance.axis}): ${relevance.reason}`);
    return null;
  }

  let markdownContent = await generateArticle(TOPIC, cluster.context, recentTitles);

  markdownContent = markdownContent.replace(/^```markdown\n/m, '');
  markdownContent = markdownContent.replace(/\n```$/m, '');

  console.log(`[${clusterIndex + 1}/${totalClusters}] Revisando com Kimi...`);
  markdownContent = await reviewAndImprove(markdownContent);

  const matterResult = matter(markdownContent);
  const articleTitle = matterResult.data.title || 'Inovação em Tecnologia e IA';
  const articleTags: string[] = matterResult.data.tags || [];
  matterResult.data.date = toBrazilianISO(new Date());

  console.log(`[${clusterIndex + 1}/${totalClusters}] Gerando imagem: "${articleTitle}"`);
  matterResult.data.image = await generateImageWithGemini(articleTitle, articleTags, fileName);

  const finalMarkdown = matter.stringify(matterResult.content, matterResult.data);

  // Save article
  const articlesDir = path.join(process.cwd(), 'content', 'articles');
  ensureDir(articlesDir);
  fs.writeFileSync(path.join(articlesDir, `${fileName}.md`), finalMarkdown, 'utf-8');
  console.log(`[${clusterIndex + 1}/${totalClusters}] Artigo salvo: ${fileName}.md`);

  // Summary
  console.log(`[${clusterIndex + 1}/${totalClusters}] Gerando briefing privado...`);
  const summary = await generatePrivateSummary(finalMarkdown) as Record<string, unknown>;
  const summariesDir = path.join(process.cwd(), 'data', 'summaries');
  ensureDir(summariesDir);
  fs.writeFileSync(
    path.join(summariesDir, `${fileName}.json`),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );

  // Slides
  console.log(`[${clusterIndex + 1}/${totalClusters}] Gerando slides...`);
  const slides = await generateSlides(finalMarkdown, articleTitle);
  const slidesDir = path.join(process.cwd(), 'data', 'slides');
  ensureDir(slidesDir);
  fs.writeFileSync(
    path.join(slidesDir, `${fileName}.json`),
    JSON.stringify(slides, null, 2),
    'utf-8'
  );

  // Appenda ao resumo diário vivo
  const summaryEntry: ArticleSummaryEntry = {
    slug: fileName,
    title: articleTitle,
    tags: articleTags,
    image: matterResult.data.image,
    tldr: (summary.tldr as string) || '',
    key_facts: (summary.key_facts as string[]) || [],
    why_it_matters: (summary.why_it_matters as string) || '',
    watch_next: (summary.watch_next as string[]) || [],
    editorial_angle: (summary.editorial_angle as string) || '',
    generatedAt: new Date().toISOString(),
  };

  appendArticleToDailySummary(summaryEntry);
  generatedEntries.push(summaryEntry);
  console.log(`[${clusterIndex + 1}/${totalClusters}] Adicionado ao resumo do dia.`);

  if (SEND_ARTICLE_EMAILS) {
    try {
      await notifySubscribersAboutNewArticle(summaryEntry);
    } catch (err) {
      console.error(`[${clusterIndex + 1}/${totalClusters}] Erro ao enviar email do novo artigo:`, err);
    }
  } else {
    console.log(`[${clusterIndex + 1}/${totalClusters}] Email adiado para etapa pos-deploy.`);
  }

  console.log(`[${clusterIndex + 1}/${totalClusters}] Concluido: ${fileName}`);
  return articleTitle;
}

async function main() {
  try {
    console.log('Buscando clusters de noticias ineditas...');
    const clusters = await fetchTopicClusters();

    if (clusters.length === 0) {
      ensureDir(path.dirname(GENERATED_RUN_PATH));
      fs.writeFileSync(GENERATED_RUN_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), articles: [] }, null, 2), 'utf8');
      console.log('Nenhuma noticia nova encontrada. Abortando.');
      process.exit(0);
    }

    console.log(`${clusters.length} cluster(s) encontrado(s). Iniciando geracao de artigos...`);

    const recentArticles = getSortedArticlesData();
    const allTitles = recentArticles.map(a => a.title); // todos, não só 10

    const allNewUrls: string[] = [];
    const generatedEntries: ArticleSummaryEntry[] = [];
    let successCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < clusters.length; i++) {
      // Verifica duplicata ANTES de chamar a IA
      const { covered, matchedTitle } = topicAlreadyCovered(clusters[i], allTitles);
      if (covered) {
        console.log(`[${i + 1}/${clusters.length}] Pulando — assunto já coberto por: "${matchedTitle}"`);
        skippedCount++;
        continue;
      }

      try {
        const title = await processCluster(i, clusters.length, clusters[i], allTitles, generatedEntries);
        if (title) {
          allTitles.unshift(title); // adiciona ao pool para os próximos clusters da mesma rodada
          allNewUrls.push(...clusters[i].urls);
          successCount++;
        }
      } catch (err) {
        console.error(`Erro no cluster ${i + 1}, continuando para o proximo:`, err);
      }
    }

    // Update URL history
    const historyPath = path.join(process.cwd(), 'data', 'history.json');
    ensureDir(path.join(process.cwd(), 'data'));
    let usedUrls: string[] = [];
    if (fs.existsSync(historyPath)) {
      usedUrls = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }
    usedUrls.push(...allNewUrls);
    fs.writeFileSync(historyPath, JSON.stringify(usedUrls, null, 2), 'utf8');
    fs.writeFileSync(GENERATED_RUN_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), articles: generatedEntries }, null, 2), 'utf8');

    console.log(`\nConcluido! ${successCount} gerados, ${skippedCount} pulados (assunto ja coberto), ${clusters.length - successCount - skippedCount} com erro.`);
  } catch (error) {
    console.error('Erro fatal:', error);
    process.exit(1);
  }
}

main();
