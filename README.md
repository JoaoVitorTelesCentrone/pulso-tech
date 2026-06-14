# Tech&Future — Blog Editorial com IA

> Blog autônomo de tecnologia e inteligência artificial que gera, publica e distribui conteúdo automaticamente, sem intervenção humana.

---

## O que é isso?

**Tech&Future** é um sistema editorial completo movido por IA. Ele busca notícias na internet, escolhe os assuntos mais relevantes do momento, escreve artigos aprofundados em português e ainda gera formatos derivados — slides, carrosséis para LinkedIn e briefings editoriais privados. Tudo isso 10 vezes por dia, de forma autônoma via GitHub Actions.

Nenhuma linha de conteúdo é escrita manualmente.

---

## Como funciona

```
GitHub Actions (cron)
        │
        ▼
 Busca notícias no RSS e na web
        │
        ▼
 Agrupa por tema e evita repetições
        │
        ▼
 DeepSeek gera artigo completo (800+ palavras)
        │
        ├──▶ Slides (deck de 6-8 slides)
        ├──▶ 4 Carrosséis para LinkedIn
        ├──▶ Briefing editorial privado (TLDR, fatos, contexto)
        └──▶ Imagem de capa (Google Gemini)
        │
        ▼
 Commit automático no repositório
        │
        ▼
 Next.js serve o conteúdo para os leitores
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS com design system próprio |
| Geração de texto | DeepSeek (`deepseek-chat`) via OpenAI SDK |
| Geração de imagem | Google Gemini / Pollinations.ai |
| Automação | GitHub Actions (10 crons/dia) |
| Conteúdo | Markdown com frontmatter |

---

## Funcionalidades

### Geração automática de artigos
Cada execução busca notícias frescas, descarta assuntos já publicados e produz um artigo com deep dive em um único tema. Mínimo de 800 palavras, estrutura SEO, links embutidos e fontes citadas.

### Slides
Para cada artigo é gerado um deck de apresentação com 6 a 8 slides (capa, contexto, insights, dados, impacto, CTA) pronto para usar.

### Carrosséis para LinkedIn
4 carrosséis por artigo, cada um com um ângulo diferente: educacional, impacto pessoal, dados/números e perspectiva futura. Seguem um sistema de identidade visual fixo com paleta e tipografia definidas.

### Briefing editorial privado
Resumo executivo de cada artigo com TLDR, fatos principais, por que importa e desdobramentos a acompanhar.

### Deduplicação inteligente
O sistema mantém um histórico de URLs e títulos já abordados para garantir que cada publicação trate de algo diferente.

---

## Agendamento

O pipeline roda **10 vezes por dia** automaticamente:

| Horário BRT | Horário UTC |
|---|---|
| 06:00 | 09:00 |
| 08:00 | 11:00 |
| 10:00 | 13:00 |
| 12:00 | 15:00 |
| 14:00 | 17:00 |
| 16:00 | 19:00 |
| 18:00 | 21:00 |
| 20:00 | 23:00 |
| 22:00 | 01:00 |
| 00:00 | 03:00 |

---

## Estrutura do projeto

```
├── app/                    # Rotas Next.js
│   ├── post/[slug]/        # Leitor de artigos
│   ├── slides/[slug]/      # Visualizador de slides
│   ├── carousel/[slug]/    # Visualizador de carrosséis
│   ├── archive/            # Arquivo de edições
│   └── api/cron/           # Endpoint de disparo manual
├── components/             # Componentes React
├── content/articles/       # Artigos gerados (.md)
├── data/
│   ├── summaries/          # Briefings em JSON
│   ├── slides/             # Decks em JSON
│   ├── carousels/          # Carrosséis em JSON
│   └── history.json        # Controle de duplicatas
├── lib/
│   ├── ai-generator.ts     # Chamadas ao DeepSeek
│   └── news-fetcher.ts     # Busca e clusterização de notícias
├── scripts/
│   └── generate-article.ts # Orquestrador principal
└── .github/workflows/
    └── ai-cron.yml         # Pipeline de automação
```

---

## Variáveis de ambiente

Para rodar localmente ou configurar no GitHub Actions:

```env
DEEPSEEK_API_KEY=sua_chave_aqui
GEMINI_API_KEY=sua_chave_aqui
```

No GitHub: **Settings → Secrets and variables → Actions**.

---

## Rodando localmente

```bash
# Instalar dependências
npm install

# Gerar artigos manualmente
npm run generate

# Subir o blog em desenvolvimento
npm run dev
```

---

## Design system

Paleta de cores fixa usada em todo o blog e nos carrosséis:

| Nome | Hex |
|---|---|
| Ink | `#0D0D0B` |
| Cream | `#F4F0E8` |
| Paper | `#EDE8DC` |
| Warm Gray | `#C8C3B8` |
| Muted | `#7A7670` |
| Electric | `#C9FF47` |

Tipografia: **Syne** (títulos) · **Cormorant Garamond** (corpo) · **DM Mono** (metadados)

---

## Licença

MIT
