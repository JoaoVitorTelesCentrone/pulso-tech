import { fetchTopicClusters } from '../lib/news-fetcher';
import {
  generateArticle,
  generatePrivateSummary,
  generateSlides,
  generateCarousels,
} from '../lib/ai-generator';
import { buildImagePrompt, getNegativePrompt } from '../lib/image-prompts';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getSortedArticlesData } from '../lib/markdown';

const TOPIC = 'Os principais destaques e inovações em Inteligência Artificial e Tecnologia hoje';

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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
  recentTitles: string[]
): Promise<string | null> {
  console.log(`\n[${clusterIndex + 1}/${totalClusters}] Gerando artigo...`);

  const dateStr = new Date().toISOString().split('T')[0];
  const uniqueId = Math.random().toString(36).substring(2, 7);
  const fileName = `${dateStr}-${uniqueId}`;

  let markdownContent = await generateArticle(TOPIC, cluster.context, recentTitles);

  markdownContent = markdownContent.replace(/^```markdown\n/m, '');
  markdownContent = markdownContent.replace(/\n```$/m, '');

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
  const summary = await generatePrivateSummary(finalMarkdown);
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

  // Carousels
  console.log(`[${clusterIndex + 1}/${totalClusters}] Gerando carrosseis...`);
  const carousels = await generateCarousels(finalMarkdown, articleTitle);
  const carouselsDir = path.join(process.cwd(), 'data', 'carousels');
  ensureDir(carouselsDir);
  fs.writeFileSync(
    path.join(carouselsDir, `${fileName}.json`),
    JSON.stringify(carousels, null, 2),
    'utf-8'
  );

  console.log(`[${clusterIndex + 1}/${totalClusters}] Todos os artefatos salvos para: ${fileName}`);
  return articleTitle;
}

async function main() {
  try {
    console.log('Buscando clusters de noticias ineditas...');
    const clusters = await fetchTopicClusters();

    if (clusters.length === 0) {
      console.log('Nenhuma noticia nova encontrada. Abortando.');
      process.exit(0);
    }

    console.log(`${clusters.length} cluster(s) encontrado(s). Iniciando geracao de artigos...`);

    const recentArticles = getSortedArticlesData();
    const recentTitles = recentArticles.slice(0, 10).map(a => a.title);

    const allNewUrls: string[] = [];
    let successCount = 0;

    for (let i = 0; i < clusters.length; i++) {
      try {
        const title = await processCluster(i, clusters.length, clusters[i], recentTitles);
        if (title) {
          recentTitles.unshift(title);
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

    console.log(`\nConcluido! ${successCount}/${clusters.length} artigos gerados com sucesso.`);
  } catch (error) {
    console.error('Erro fatal:', error);
    process.exit(1);
  }
}

main();
