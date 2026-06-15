import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

function cleanJson(text: string): string {
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');
  return text.trim();
}

export async function generateArticle(topic: string, context: string, recentTitles: string[] = []): Promise<string> {
  const recentTopicsText = recentTitles.length > 0
    ? `\nATENÇÃO: Os assuntos abaixo JÁ foram abordados recentemente no blog. NÃO escolha notícias que tratem do mesmo assunto. Busque uma inovação ou notícia diferente:\n${recentTitles.map(t => `- ${t}`).join('\n')}\n`
    : '';

  const prompt = `Você é um redator profissional de blog sobre tecnologia e inteligência artificial.

Tarefa:
Você recebeu as informações INÉDITAS da internet sobre o tema abaixo no campo [CONTEXTO].
Escolha a notícia MAIS impactante desse contexto e faça um "deep dive" (mergulho profundo) nela, em vez de fazer um resumo raso de todas. Escreva um post completo em português, pronto para publicação.
${recentTopicsText}

Tema: "${topic}"

[CONTEXTO]
${context}
[/CONTEXTO]

Regras obrigatórias:
1. O post deve ter:
   - Título principal cativante e otimizado para SEO.
   - Subtítulo com gancho.
   - Introdução (2-3 parágrafos).
   - Desenvolvimento dividido em 3-4 seções com subtítulos (formato H2).
   - Conclusão com resumo ou perspectiva futura.
   - Seção "Fontes consultadas" com links clicáveis das fontes do [CONTEXTO].
2. Formate TUDO em Markdown, seguindo RIGOROSAMENTE esta estrutura com frontmatter no topo.
IMPORTANTE: NÃO inclua blocos de formatação markdown (como crase tripla) na sua resposta. Comece o texto DIRETAMENTE com os 3 traços (---):

---
title: "TÍTULO AQUI"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2", "tag3"]
---

# Título Principal

**Subtítulo envolvente**

## Introdução
(conteúdo)

## Seção 1: (subtítulo)
(conteúdo com links embutidos quando pertinente, ex: [Fonte](URL))

## Seção 2: (subtítulo)
(conteúdo)

## Seção 3: (subtítulo)
(conteúdo)

## Conclusão
(conteúdo)

### Fontes Consultadas
- [Título da Fonte 1](URL)
- [Título da Fonte 2](URL)

3. Use linguagem acessível mas técnica na medida certa.
4. Mínimo de 800 palavras.
5. Inclua pelo menos 3 links embutidos no corpo do texto para as fontes originais.
6. Não use a sintaxe de footnotes [^1]. Coloque os links diretamente no texto e crie uma lista simples no final.
7. Não invente dados. Baseie-se no [CONTEXTO] fornecido.`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    let text = response.choices[0]?.message?.content || '';
    text = text.replace(/^```markdown\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');
    text = text.trim();

    if (!text.startsWith('---')) {
      text = '---\n' + text;
    }

    return text;
  } catch (error) {
    console.error('Erro ao gerar artigo com DeepSeek:', error);
    throw error;
  }
}

export const generateArticleWithGemini = generateArticle;

export async function generatePrivateSummary(articleMarkdown: string): Promise<object> {
  const prompt = `Você é um editor sênior de tecnologia. Analise o artigo abaixo e retorne SOMENTE um JSON com o briefing editorial privado.

ARTIGO:
${articleMarkdown.substring(0, 4000)}

Retorne EXATAMENTE este JSON (sem texto adicional, sem markdown):
{
  "tldr": "Uma frase resumindo o artigo",
  "key_facts": ["fato 1", "fato 2", "fato 3"],
  "why_it_matters": "Por que esta notícia importa para o leitor de IA/Tech",
  "watch_next": ["desdobramento 1", "desdobramento 2"],
  "editorial_angle": "O que diferencia este artigo dos demais e por que foi escolhido"
}`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 1000,
    });

    const text = response.choices[0]?.message?.content || '{}';
    return JSON.parse(cleanJson(text));
  } catch (error) {
    console.error('Erro ao gerar resumo privado:', error);
    return { tldr: 'Resumo não disponível', key_facts: [], why_it_matters: '', watch_next: [], editorial_angle: '' };
  }
}

export async function generateSlides(articleMarkdown: string, articleTitle: string): Promise<object> {
  const prompt = `Você é um designer de apresentações de tecnologia. Com base no artigo abaixo, crie um deck de slides impactante.

ARTIGO:
${articleMarkdown.substring(0, 4000)}

Retorne EXATAMENTE este JSON com 6 a 8 slides (sem texto adicional, sem markdown):
{
  "title": "${articleTitle}",
  "theme": "dark-tech",
  "slides": [
    {
      "type": "cover",
      "headline": "título principal impactante",
      "subtext": "subtítulo que cria curiosidade",
      "image_prompt": "prompt em inglês para gerar imagem de fundo"
    },
    {
      "type": "context",
      "heading": "O Cenário",
      "body": "2-3 frases sobre o contexto da notícia",
      "highlight": "dado ou frase de destaque"
    },
    {
      "type": "insight",
      "heading": "O que está acontecendo",
      "body": "explicação clara do fato principal",
      "visual_hint": "sugestão de visual ou ícone"
    },
    {
      "type": "insight",
      "heading": "Por que importa",
      "body": "impacto real para pessoas e empresas",
      "visual_hint": "sugestão de visual"
    },
    {
      "type": "data",
      "heading": "Números que contam a história",
      "bullets": ["dado 1", "dado 2", "dado 3"]
    },
    {
      "type": "impact",
      "heading": "O que muda daqui pra frente",
      "bullets": ["consequência 1", "consequência 2", "consequência 3"]
    },
    {
      "type": "cta",
      "headline": "Acompanhe o blog para saber mais",
      "subtext": "frase de encerramento instigante"
    }
  ]
}`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const text = response.choices[0]?.message?.content || '{}';
    return JSON.parse(cleanJson(text));
  } catch (error) {
    console.error('Erro ao gerar slides:', error);
    return { title: articleTitle, theme: 'dark-tech', slides: [] };
  }
}

const CAROUSEL_SYSTEM_PROMPT = `Você é um editor sênior de conteúdo visual para LinkedIn do blog Tech&Future.

MISSÃO: Transformar artigos densos em carrosséis que ensinam de verdade — usando os dados reais, citações reais e argumentos reais do artigo. NUNCA invente dados ou generalize. Cada slide deve conter uma informação específica extraída do texto.

TIPOS DE SLIDE E CAMPOS:
cover:   { "headline": "afirmação direta e impactante, máx 12 palavras", "subtext": "contexto em 1 linha" }
stat:    { "stat_number": "número exato do artigo (ex: 74%, $52B, 97,2%)", "stat_label": "o que esse número significa, 1-2 frases diretas" }
quote:   { "quote": "\"citação real ou paráfrase fiel do artigo, máx 30 palavras\"" }
content: { "topic_number": "01", "headline": "tópico em até 8 palavras", "body": "explicação com detalhe real do artigo, 2-3 frases, máx 40 palavras" }
list:    { "headline": "título da lista", "items": ["item específico com dado ou fato", "item específico", "item específico"] }
cta:     { "headline": "pergunta ou provocação direta relacionada ao tema", "highlight_word": "uma palavra do headline", "subtext": "convite para ler o artigo completo" }

REGRAS INEGOCIÁVEIS:
- Use APENAS informações presentes no artigo. Nenhum dado inventado.
- Slides de "stat" devem ter números reais do artigo (percentuais, valores, anos, quantidades).
- Slides de "quote" devem ser citações ou paráfrases fiéis de especialistas mencionados no artigo.
- Slides de "content" devem explicar um mecanismo, causa ou consequência real descrita no artigo — não generalidades.
- Slides de "list" devem listar itens concretos do artigo (tecnologias, empresas, eventos, dados).
- Tom: direto, verbos ativos, frases curtas. Escreva como se estivesse explicando para um colega inteligente.
- PROIBIDO: "pode ser que", "potencialmente", "é interessante notar", frases vagas sem substância.

ESTRUTURA DE CADA CARROSSEL:
- 7 slides
- Slide 1: sempre "cover"
- Slide 7: sempre "cta"
- Slides 2-6: mistura de content, stat, quote, list — cada um com conteúdo específico diferente`;

export async function generateCarousels(articleMarkdown: string, articleTitle: string): Promise<object[]> {
  const userPrompt = `Leia o artigo abaixo com atenção. Extraia os fatos, números, citações e argumentos mais relevantes. Depois crie 4 carrosséis para LinkedIn, cada um explorando um ângulo diferente do mesmo conteúdo.

ARTIGO COMPLETO:
${articleMarkdown.substring(0, 5000)}

ÂNGULOS OBRIGATÓRIOS (um por carrossel):
1. Educacional — explica o "como" e o "por que" do tema com dados e mecanismos reais
2. Impacto pessoal — como isso muda a vida/trabalho de quem lê, com exemplos concretos do artigo
3. Dados e números — carrossel focado nas estatísticas e fatos quantitativos do artigo
4. Futuro e consequências — o que acontece a seguir, baseado nas análises e projeções do artigo

IMPORTANTE: Cada slide deve conter informação ESPECÍFICA do artigo. Se o artigo menciona "74% dos desenvolvedores", use esse número. Se cita uma empresa ou pessoa, mencione pelo nome. Se descreve um mecanismo, explique-o.

Retorne EXATAMENTE este JSON (sem texto adicional, sem markdown):
{
  "carousels": [
    {
      "carousel_id": 1,
      "angle": "descrição do ângulo em até 6 palavras",
      "slides": [
        { "n": 1, "type": "cover", "headline": "...", "subtext": "..." },
        { "n": 2, "type": "content", "topic_number": "01", "headline": "...", "body": "..." },
        { "n": 3, "type": "stat", "stat_number": "...", "stat_label": "..." },
        { "n": 4, "type": "quote", "quote": "\"...\"" },
        { "n": 5, "type": "content", "topic_number": "02", "headline": "...", "body": "..." },
        { "n": 6, "type": "list", "headline": "...", "items": ["...", "...", "..."] },
        { "n": 7, "type": "cta", "headline": "...", "highlight_word": "...", "subtext": "..." }
      ]
    }
  ]
}`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: CAROUSEL_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 6000,
    });

    const text = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(cleanJson(text));
    const carousels: object[] = Array.isArray(parsed) ? parsed : (parsed.carousels || []);

    const templates = ['A', 'B', 'C', 'D', 'E', 'F'];
    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    return carousels.map((c: any, i: number) => ({
      ...c,
      template: shuffled[i % shuffled.length],
    }));
  } catch (error) {
    console.error('Erro ao gerar carrosseis:', error);
    return [];
  }
}
