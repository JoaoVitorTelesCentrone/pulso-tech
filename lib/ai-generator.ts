import OpenAI from 'openai';

const MODEL = 'deepseek-chat';

function getClient() {
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
  });
}

function getKimiClient() {
  return new OpenAI({
    apiKey: process.env.KIMI_API_KEY,
    baseURL: 'https://api.moonshot.cn/v1',
  });
}

function hasKimiApiKey(): boolean {
  return Boolean(process.env.KIMI_API_KEY?.trim());
}

export async function reviewAndImprove(markdown: string): Promise<string> {
  if (!hasKimiApiKey()) return markdown;

  const prompt = `Você é um editor sênior do Pulso, newsletter de análise de tecnologia e economia.

Recebeu o rascunho de um artigo gerado por IA. Sua tarefa é reescrever e melhorar o texto mantendo TODA a estrutura e informação, mas com qualidade editorial superior.

REGRAS INEGOCIÁVEIS:
1. Mantenha o frontmatter (---...---) EXATAMENTE igual, sem alterar nada
2. Mantenha o marcador <!-- premium --> exatamente onde está — ele divide o conteúdo free/premium
3. Mantenha todos os H2 (##) e a estrutura de seções
4. Mantenha os links e fontes
5. NÃO adicione nem remova seções
6. NÃO use crase tripla ou blocos de código na resposta

O QUE MELHORAR:
- Abertura mais impactante — primeiro parágrafo deve prender imediatamente
- Parágrafos mais densos e analíticos, menos genéricos
- Frases mais diretas e ativas (menos "pode ser que", "é interessante notar")
- Dados e números em destaque com contexto claro
- Tom mais de "insider" — escreva como quem entende profundamente o assunto
- Português mais fluido e preciso
- A parte premium deve justificar a assinatura: análise mais profunda, conexões não óbvias, implicações práticas reais

Retorne APENAS o markdown melhorado, começando diretamente com os três traços do frontmatter (---).

RASCUNHO:
${markdown}`

  try {
    const response = await getKimiClient().chat.completions.create({
      model: process.env.KIMI_MODEL || 'moonshot-v1-32k',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 4000,
    })

    let text = response.choices[0]?.message?.content || markdown
    text = text.replace(/^```markdown\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim()

    if (!text.startsWith('---')) return markdown
    return text
  } catch (error) {
    console.warn('[Kimi] Revisão falhou, usando rascunho original:', (error as Error).message)
    return markdown
  }
}

function cleanJson(text: string): string {
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');
  return text.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function isValidSummary(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  return (
    typeof value.tldr === 'string' &&
    isStringArray(value.key_facts) &&
    typeof value.why_it_matters === 'string' &&
    isStringArray(value.watch_next) &&
    typeof value.editorial_angle === 'string'
  );
}

function isValidSlideDeck(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  return (
    typeof value.title === 'string' &&
    typeof value.theme === 'string' &&
    Array.isArray(value.slides)
  );
}

export type RelevanceCheck = {
  approved: boolean;
  score: number;
  reason: string;
  axis: string;
};

function isValidRelevanceCheck(value: unknown): value is RelevanceCheck {
  if (!isRecord(value)) return false;
  return (
    typeof value.approved === 'boolean' &&
    typeof value.score === 'number' &&
    typeof value.reason === 'string' &&
    typeof value.axis === 'string'
  );
}

async function refineJsonWithKimi<T extends object>(
  label: string,
  original: T,
  prompt: string,
  validate: (value: unknown) => value is T,
): Promise<T> {
  if (!hasKimiApiKey()) return original;

  try {
    const response = await getKimiClient().chat.completions.create({
      model: process.env.KIMI_MODEL || 'moonshot-v1-32k',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.25,
      max_tokens: 2500,
    });

    const text = response.choices[0]?.message?.content || '';
    const parsed = JSON.parse(cleanJson(text));
    return validate(parsed) ? parsed : original;
  } catch (error) {
    console.warn(`[Kimi] Refinamento de ${label} falhou, usando versao DeepSeek:`, (error as Error).message);
    return original;
  }
}

async function refineSummaryWithKimi(
  summary: Record<string, unknown>,
  articleMarkdown: string,
): Promise<Record<string, unknown>> {
  const prompt = `Voce e um editor senior do Pulso. Recebeu um briefing privado gerado por IA para um artigo de tecnologia.

Sua tarefa e checar e refinar o JSON, mantendo EXATAMENTE os mesmos campos e retornando somente JSON valido.

REGRAS:
- Nao invente fatos, empresas, numeros ou fontes.
- Use apenas informacoes presentes no artigo.
- Torne o TLDR mais especifico e analitico.
- Troque fatos genericos por fatos concretos do artigo.
- Deixe "why_it_matters" e "editorial_angle" com mais contexto estrategico.
- Mantenha "key_facts" com 3 itens e "watch_next" com 2 itens.
- Retorne somente JSON, sem markdown.

ARTIGO:
${articleMarkdown.substring(0, 5000)}

JSON ATUAL:
${JSON.stringify(summary, null, 2)}

FORMATO OBRIGATORIO:
{
  "tldr": "Uma frase resumindo o artigo",
  "key_facts": ["fato 1", "fato 2", "fato 3"],
  "why_it_matters": "Por que esta noticia importa para o leitor de IA/Tech",
  "watch_next": ["desdobramento 1", "desdobramento 2"],
  "editorial_angle": "O que diferencia este artigo dos demais e por que foi escolhido"
}`;

  return refineJsonWithKimi('resumo privado', summary, prompt, isValidSummary);
}

async function refineSlidesWithKimi(
  slides: Record<string, unknown>,
  articleMarkdown: string,
  articleTitle: string,
): Promise<Record<string, unknown>> {
  const prompt = `Voce e um editor de narrativa visual do Pulso. Recebeu um deck de slides gerado por IA para um artigo de tecnologia.

Sua tarefa e checar e refinar o JSON, mantendo o mesmo formato geral e retornando somente JSON valido.

REGRAS:
- Nao invente fatos, numeros, empresas ou fontes.
- Use apenas informacoes presentes no artigo.
- Preserve "title", "theme" e o array "slides".
- Mantenha de 6 a 8 slides.
- Deixe headlines mais curtas, especificas e fortes.
- Deixe bodies e bullets menos genericos, com detalhe concreto do artigo.
- Mantenha prompts de imagem em ingles.
- Retorne somente JSON, sem markdown.

ARTIGO:
${articleMarkdown.substring(0, 5000)}

TITULO DO ARTIGO:
${articleTitle}

JSON ATUAL:
${JSON.stringify(slides, null, 2)}`;

  return refineJsonWithKimi('slides', slides, prompt, isValidSlideDeck);
}

export async function checkRelevanceWithKimi(
  context: string,
  recentTitles: string[] = [],
): Promise<RelevanceCheck> {
  if (!hasKimiApiKey()) {
    return {
      approved: true,
      score: 100,
      reason: 'KIMI_API_KEY ausente; gate de relevancia pulado.',
      axis: 'fallback',
    };
  }

  const prompt = `Voce e o editor-chefe do Pulso, uma newsletter diaria de IA, economia tech e programacao.

Antes de gastar tokens gerando artigo, avalie se o cluster abaixo merece virar texto.

APROVE SOMENTE se houver uma noticia concreta, recente e relevante em pelo menos um eixo:
1. ECONOMIA x TECH: IPOs, M&A, valuations, big tech, capital de risco, resultados, regulacao com impacto economico.
2. MODELOS DE IA: lancamentos, benchmarks, capacidades, APIs, pricing, pesquisa, comparacoes tecnicas relevantes.
3. PROGRAMACAO E DEV TOOLS: ferramentas, frameworks, linguagens, engenharia, open source com impacto real para devs.

PRIORIDADE MAXIMA:
- Lancamento de modelo novo ou upgrade relevante de Claude, GPT/OpenAI, Gemini/DeepMind, Llama/Meta, DeepSeek, Mistral, Qwen ou Grok.
- Mudanca de API, pricing, benchmark, janela de contexto, capacidade multimodal, agentes ou disponibilidade para desenvolvedores.
- Anuncio em fonte primaria ou cobertura forte de fonte especializada.
Esses casos devem receber score alto, exceto se forem repeticao clara dos titulos recentes.

REJEITE com rigor:
- gadget/consumer tech sem angulo economico ou tecnico forte;
- drama de rede social, celebridade, rumor ou opiniao sem dado;
- noticia generica sem consequencia clara;
- tema muito parecido com titulos recentes;
- conteudo sem fonte/link ou sem fato especifico.

Titulos recentes para evitar repeticao:
${recentTitles.slice(0, 20).map(title => `- ${title}`).join('\n') || '- nenhum'}

Cluster:
${context.substring(0, 6000)}

Retorne SOMENTE JSON valido:
{
  "approved": true,
  "score": 0,
  "reason": "explicacao curta",
  "axis": "economia-tech | modelos-ia | dev-tools | rejeitado"
}`;

  try {
    const response = await getKimiClient().chat.completions.create({
      model: process.env.KIMI_MODEL || 'moonshot-v1-32k',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 700,
    });

    const text = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(cleanJson(text));
    if (!isValidRelevanceCheck(parsed)) {
      return { approved: true, score: 60, reason: 'Resposta Kimi invalida; usando fallback permissivo.', axis: 'fallback' };
    }

    return {
      ...parsed,
      approved: parsed.approved && parsed.score >= 70,
    };
  } catch (error) {
    console.warn('[Kimi] Gate de relevancia falhou, usando fallback permissivo:', (error as Error).message);
    return { approved: true, score: 60, reason: 'Erro no gate Kimi; usando fallback permissivo.', axis: 'fallback' };
  }
}

export async function generateArticle(topic: string, context: string, recentTitles: string[] = []): Promise<string> {
  const recentTopicsText = recentTitles.length > 0
    ? `\nATENÇÃO: Os assuntos abaixo JÁ foram abordados recentemente no blog. NÃO escolha notícias que tratem do mesmo assunto. Busque uma inovação ou notícia diferente:\n${recentTitles.map(t => `- ${t}`).join('\n')}\n`
    : '';

  const prompt = `Você é um analista sênior do Pulso — newsletter diária de IA, economia tech e programação.

FOCO EDITORIAL (OBRIGATÓRIO):
Escreva APENAS sobre um destes eixos:
1. ECONOMIA × TECH: IPOs, fusões/aquisições, valuations, impacto de IA em setores econômicos, regulação, capital de risco, resultados de big tech
2. MODELOS DE IA: lançamentos, benchmarks, capacidades, comparações técnicas (GPT, Claude, Gemini, Llama, etc.), APIs, pricing, pesquisa
3. PROGRAMAÇÃO E DEV TOOLS: linguagens, frameworks, ferramentas, práticas de engenharia, open source relevante

REJEITE (não escreva sobre):
- Gadgets de consumo sem ângulo econômico ou técnico relevante
- Drama de redes sociais
- Notícias superficiais sem análise de impacto real
${recentTopicsText}
Escolha a notícia MAIS impactante do [CONTEXTO] e faça uma análise profunda em português.

Tema: "${topic}"

[CONTEXTO]
${context}
[/CONTEXTO]

ESTRUTURA OBRIGATÓRIA — divida o artigo em DUAS partes com o marcador especial:

PARTE FREE (primeiros 40% do conteúdo — todos os leitores veem):
- Título e introdução de alto impacto
- O que aconteceu: contexto, fatos principais, quem está envolvido
- Por que isso importa: análise inicial, relevância

PARTE PREMIUM (60% restante — só assinantes veem):
- Análise profunda: mecanismos, causas, dados quantitativos
- Impacto econômico, de mercado e técnico
- O que muda na prática para devs, gestores e investidores em tech
- Próximos passos e o que monitorar
- Fontes e dados detalhados

Formate TUDO em Markdown com frontmatter. NÃO inclua crase tripla. Comece DIRETAMENTE com os 3 traços (---):

---
title: "TÍTULO AQUI"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2", "tag3"]
---

# Título Principal

**Subtítulo com gancho analítico**

## O Que Aconteceu
(contexto e fatos — PARTE FREE)

## Por Que Isso Importa
(análise inicial — PARTE FREE)

<!-- premium -->

## A Análise Profunda
(mecanismos e dados — PARTE PREMIUM)

## Impacto Real: Números e Mercado
(dados quantitativos — PARTE PREMIUM)

## O Que Fazer Com Isso
(implicações práticas — PARTE PREMIUM)

## O Que Monitorar
(próximos passos — PARTE PREMIUM)

### Fontes
- [Título da Fonte 1](URL)
- [Título da Fonte 2](URL)

Regras adicionais:
- Mínimo de 900 palavras no total
- Inclua o marcador EXATO <!-- premium --> entre a parte free e a premium
- Use dados reais do [CONTEXTO]. Não invente números.
- Tom: direto, analítico, sem hype. Escreva para quem toma decisões.`;

  try {
    const response = await getClient().chat.completions.create({
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
    const response = await getClient().chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 1000,
    });

    const text = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(cleanJson(text));
    const summary = isValidSummary(parsed)
      ? parsed
      : { tldr: 'Resumo nao disponivel', key_facts: [], why_it_matters: '', watch_next: [], editorial_angle: '' };

    return refineSummaryWithKimi(summary, articleMarkdown);
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
    const response = await getClient().chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const text = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(cleanJson(text));
    const slideDeck = isValidSlideDeck(parsed)
      ? parsed
      : { title: articleTitle, theme: 'dark-tech', slides: [] };

    return refineSlidesWithKimi(slideDeck, articleMarkdown, articleTitle);
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
    const response = await getClient().chat.completions.create({
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
