import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';

type CustomItem = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  content?: string;
};

export type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  snippet: string;
  source: string;
};

export type TopicCluster = {
  items: NewsItem[];
  urls: string[];
  context: string;
};

const parser = new Parser<any, CustomItem>();

const RSS_FEEDS = [
  // Economia × Tech (mercados, regulação, IPOs, IA em setores)
  'https://techcrunch.com/category/startups/feed/',
  'https://techcrunch.com/category/venture/feed/',
  'https://www.theverge.com/rss/index.xml',
  'https://openai.com/news/rss.xml',
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://venturebeat.com/category/ai/feed/',
  'https://www.technologyreview.com/feed/',
  'https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss',
  'https://huggingface.co/blog/feed.xml',
  // IA, modelos e pesquisa
  'https://hnrss.org/frontpage',
  'https://rss.arxiv.org/rss/cs.AI',
  'https://rss.arxiv.org/rss/cs.LG',
  'https://rss.arxiv.org/rss/cs.CL',
  // Programação e dev tools
  'https://thenewstack.io/feed/',
  'https://www.theregister.com/software/headlines.atom',
  'https://www.theregister.com/devops/headlines.atom',
  'https://feeds.arstechnica.com/arstechnica/technology-lab',
];

// Keywords that signal an article is on-topic for Pulso
const RELEVANT_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'llm', 'model', 'openai', 'anthropic',
  'deepmind', 'gemini', 'llama', 'copilot', 'gpu', 'datacenter', 'data center',
  'inference', 'training', 'agent', 'agents', 'reasoning', 'benchmark', 'eval',
  'multimodal', 'transformer', 'merger', 'venture', 'capital', 'earnings',
  'margin', 'software engineering', 'sdk', 'database', 'cloud', 'devops',
  'kubernetes', 'security', 'cybersecurity', 'copyright', 'lawsuit',
  'enterprise', 'saas', 'programacao',
  'google', 'meta', 'microsoft', 'nvidia', 'chip', 'semiconductor',
  'startup', 'funding', 'ipo', 'acquisition', 'valuation', 'billion',
  'developer', 'programming', 'open source', 'api', 'framework',
  'regulation', 'antitrust', 'gdpr', 'data', 'privacy',
  'economy', 'market', 'stock', 'revenue', 'profit',
  'inteligência artificial', 'modelo', 'mercado', 'economia',
];

const PRIORITY_SOURCE_KEYWORDS = [
  'openai.com',
  'anthropic',
  'deepmind',
  'venturebeat',
  'artificial-intelligence',
  'huggingface',
  'arxiv.org',
];

const BREAKING_AI_KEYWORDS = [
  'launch', 'launched', 'release', 'released', 'announces', 'announced', 'introduces',
  'new model', 'frontier model', 'reasoning model', 'claude', 'gpt', 'gemini', 'llama',
  'deepseek', 'mistral', 'qwen', 'grok', 'opus', 'sonnet', 'haiku', 'benchmark',
  'api', 'pricing', 'open weights', 'open-weight', 'multimodal', 'agent',
];

function isRelevant(title: string, snippet: string): boolean {
  const text = (title + ' ' + snippet).toLowerCase();
  return RELEVANT_KEYWORDS.some(kw => text.includes(kw));
}

function daysSince(pubDate: string): number {
  const time = Date.parse(pubDate);
  if (Number.isNaN(time)) return 30;
  return Math.max(0, (Date.now() - time) / (1000 * 60 * 60 * 24));
}

function scoreItem(item: NewsItem): number {
  const text = `${item.title} ${item.snippet} ${item.link} ${item.source}`.toLowerCase();
  let score = 0;

  for (const keyword of PRIORITY_SOURCE_KEYWORDS) {
    if (text.includes(keyword)) score += 25;
  }

  for (const keyword of BREAKING_AI_KEYWORDS) {
    if (text.includes(keyword)) score += 18;
  }

  if (text.includes('anthropic') && text.includes('claude')) score += 80;
  if (text.includes('openai') && (text.includes('gpt') || text.includes('model'))) score += 70;
  if ((text.includes('google') || text.includes('deepmind')) && text.includes('gemini')) score += 70;
  if (text.includes('meta') && text.includes('llama')) score += 60;
  if (text.includes('nvidia') && (text.includes('gpu') || text.includes('chip'))) score += 45;

  const age = daysSince(item.pubDate);
  if (age <= 1) score += 40;
  else if (age <= 3) score += 25;
  else if (age <= 7) score += 10;
  else score -= Math.min(30, age);

  return score;
}

function sortByEditorialPriority(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => scoreItem(b) - scoreItem(a));
}

function scoreCluster(items: NewsItem[]): number {
  return Math.max(...items.map(scoreItem));
}

const MAX_CLUSTERS = 8;

const STOP_WORDS = new Set([
  'the', 'this', 'that', 'with', 'from', 'have', 'will', 'been',
  'como', 'para', 'com', 'uma', 'mais', 'into', 'about', 'your',
  'what', 'when', 'where', 'which', 'their', 'there', 'here',
  'just', 'more', 'than', 'over', 'after', 'before', 'could',
  'would', 'should', 'using', 'gets', 'says', 'also', 'its',
]);

function extractKeywords(title: string): Set<string> {
  return new Set(
    title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !STOP_WORDS.has(w))
  );
}

function groupByTopic(items: NewsItem[]): NewsItem[][] {
  const clusters: NewsItem[][] = [];
  const assigned = new Set<number>();

  for (let i = 0; i < items.length; i++) {
    if (assigned.has(i)) continue;
    const cluster: NewsItem[] = [items[i]];
    assigned.add(i);
    const keywordsI = extractKeywords(items[i].title);

    for (let j = i + 1; j < items.length; j++) {
      if (assigned.has(j)) continue;
      const keywordsJ = extractKeywords(items[j].title);
      const overlap = [...keywordsI].filter(w => keywordsJ.has(w)).length;
      if (overlap >= 2) {
        cluster.push(items[j]);
        assigned.add(j);
      }
    }
    clusters.push(cluster);
  }
  return clusters;
}

function buildContext(items: NewsItem[]): string {
  let context = 'Aqui estão as notícias coletadas sobre este tema:\n\n';
  for (const item of items) {
    context += `Fonte: ${item.source}\n`;
    context += `- Título: ${item.title}\n`;
    context += `  Data: ${item.pubDate}\n`;
    context += `  Link: ${item.link}\n`;
    context += `  Resumo: ${item.snippet}...\n\n`;
  }
  return context;
}

export async function fetchTopicClusters(): Promise<TopicCluster[]> {
  const historyPath = path.join(process.cwd(), 'data', 'history.json');
  let usedUrls: string[] = [];

  if (fs.existsSync(historyPath)) {
    usedUrls = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  }

  const allItems: NewsItem[] = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const freshItems = feed.items.filter(
        (item: CustomItem) => item.link && !usedUrls.includes(item.link)
      );

      for (const item of freshItems.slice(0, 8)) {
        const title = item.title || '';
        const snippet = (item.contentSnippet || item.content || '').substring(0, 300);
        if (!isRelevant(title, snippet)) continue;
        allItems.push({
          title,
          link: item.link || '',
          pubDate: item.pubDate || '',
          snippet,
          source: feed.title || feedUrl,
        });
      }
    } catch (error) {
      console.error(`Erro ao buscar feed ${feedUrl}:`, error);
    }
  }

  if (allItems.length === 0) return [];

  const groups = groupByTopic(sortByEditorialPriority(allItems))
    .sort((a, b) => scoreCluster(b) - scoreCluster(a));

  return groups.slice(0, MAX_CLUSTERS).map(items => ({
    items,
    urls: items.map(i => i.link).filter(Boolean),
    context: buildContext(items),
  }));
}
