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
  'https://techcrunch.com/feed/',
  'https://www.theverge.com/rss/index.xml',
  'https://www.wired.com/feed/rss',
];

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

      for (const item of freshItems.slice(0, 5)) {
        allItems.push({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          snippet: (item.contentSnippet || item.content || '').substring(0, 300),
          source: feed.title || feedUrl,
        });
      }
    } catch (error) {
      console.error(`Erro ao buscar feed ${feedUrl}:`, error);
    }
  }

  if (allItems.length === 0) return [];

  const groups = groupByTopic(allItems);

  return groups.slice(0, MAX_CLUSTERS).map(items => ({
    items,
    urls: items.map(i => i.link).filter(Boolean),
    context: buildContext(items),
  }));
}
