import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export type ArticleFrontmatter = {
  title: string;
  date: string;
  tags?: string[];
  slug: string;
  image?: string;
  createdAt?: number;
};

export type Article = ArticleFrontmatter & {
  contentHtml: string;
  excerpt?: string;
};

const articlesDirectory = path.join(process.cwd(), 'content', 'articles');

// Obtém uma lista ordenada de todos os artigos, do mais recente ao mais antigo
export function getSortedArticlesData(): ArticleFrontmatter[] {
  // Garantir que a pasta exista
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticlesData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Usa gray-matter para separar a seção de metadados (frontmatter)
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title || 'Sem Título',
        date: matterResult.data.date || new Date().toISOString(),
        tags: matterResult.data.tags || [],
        image: matterResult.data.image,
        createdAt: fs.statSync(fullPath).mtimeMs,
      };
    });

  return allArticlesData.sort((a, b) => {
    // Tenta ordenar pela data do frontmatter
    if (a.date !== b.date) {
      return a.date < b.date ? 1 : -1;
    }
    // Se a data for igual (mesmo dia), desempata pela hora de criação do arquivo
    const timeA = a.createdAt || 0;
    const timeB = b.createdAt || 0;
    return timeB - timeA;
  });
}

// Obtém o conteúdo completo de um artigo pelo slug
export async function getArticleData(slug: string): Promise<Article> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Usa gray-matter para separar a seção de metadados
  const matterResult = matter(fileContents);

  // Usa remark para converter markdown em HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: matterResult.data.title || 'Sem Título',
    date: matterResult.data.date || new Date().toISOString(),
    tags: matterResult.data.tags || [],
    image: matterResult.data.image,
    contentHtml,
    excerpt: matterResult.content.substring(0, 300) + '...', // Um resumo simples
  };
}
