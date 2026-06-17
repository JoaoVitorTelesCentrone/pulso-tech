# Mind Space — Design System

> Editorial brand for a Portuguese-language journaling/self-reflection app. Cream paper, black ink, one coral accent. A brain-tree mark. Soft serif italic for intimacy; a heavy condensed display for moments of impact.

Mind Space gives users a single warm, unhurried place to capture thoughts across categorized streams (Princípios, Ideias, Reflexões, Medos, Objetivos), answer self-prompts, sketch on a freeform canvas, and share favourite entries as 9:16 stories.

The visual register has two gears:
- **Intimate mode** — Fraunces italic, lowercase, soft, second-person Portuguese. Daily UI.
- **Editorial mode** — Anton uppercase, big and confident, paired with the coral pop. Marketing surfaces, story templates, hero moments.

The product alternates between the two; the calm always wins, the editorial punctuates.

---

## Sources

| Source | What it is | Where it lives |
|---|---|---|
| **mind-space** (`mind-space/frontend`, Next.js 15 App Router) | The canonical product. UI structure, screens, components, and Portuguese copy all come from here. | Read-only mount, accessed as `mind-space/frontend/...`. |
| **pensamentos** (`7dias/pensamentos`, Next.js 15 + shadcn) | Earlier sibling story-card generator. Same metaphor and copy DNA; visual theming not adopted. | Read-only mount, accessed as `7dias/pensamentos/...`. |
| **7dias/GUIA-COMPLETO-DESENVOLVIMENTO.md** | A 1,600-line Portuguese build guide. | Read-only mount. |
| **Brand reference imagery** (user-provided posters) | Editorial illustrations on cream — black silhouettes, single bright accent, brain-tree mark concept. Set the v2 direction. | Pinned in chat. |

---

## Content fundamentals

Mind Space's voice is permissive, intimate, and Portuguese-first.

- **Portuguese pt-BR**, sentence case headings, lowercase-y body.
- **You/yours, never we.** — *"O que está na sua mente?"*, *"Este é o seu espaço."*
- **No streaks, no shaming.** *"Sem pressa, sem cobranças."*
- **Empty states console rather than push.** *"Nenhum pensamento aqui ainda — este é um espaço só seu. ✨"*
- **The serif italic carries emotional weight.** Section headings ("Princípios", "Do passado", "Últimos 7 dias") are *Fraunces italic*.
- **The condensed display carries energy.** Marketing and poster moments use *Anton* uppercase — the brand's loud voice.
- **Emoji** are used sparingly: one per default category (🎯 💡 🌱 😰 🏔️ 🪞 🎨), plus ✨ 💜 in supporting copy. Never decoration.

### Tone examples (verbatim where shipped)

| Surface | Copy |
|---|---|
| Home greeting | *"Olá, como você está?"* / *"Este é o seu espaço. Sem pressa, sem cobranças."* |
| QuickAdd | *"O que está na sua mente?"* / *"Escreva livremente... sem julgamentos."* |
| Marketing headline | **BE KIND TO YOUR MIND** (Anton uppercase, coral on "mind") |
| Empty timeline | *"Que tal começar agora? O espaço acima está esperando."* |
| Revisit widget | *"Do passado"* |
| Confirm dialog | *"Deletar este pensamento?"* |
| Share modal hint | *"9:16 · pronto pra stories"* |

---

## Visual foundations

### Color
A three-color editorial palette. **Paper cream `#F2EDDF`** as canvas; **ink black `#0F0E14`** as primary; **coral `#E84B2A`** as the single moment of warmth. The coral lights up CTAs, the marketing word "mind", the brand mark, share-card flourishes, and active tab pills — nowhere else. A muted **depth blue `#3F5577`** stays in reserve for editorial story-templates only (see image 4 reference).

### Type
**Four-font system, each with a single job:**

| Token | Family | Role |
|---|---|---|
| `--font-brand` | **Nauryz Redkeds** (uploaded TTF) | Wordmark only. Display-only, no Portuguese diacritic support — never use for headings or body. |
| `--font-headline` | **Anton** (Google Fonts) | Heavy condensed sans, ALWAYS UPPERCASE. Poster/marketing/hero moments. 48–96px. |
| `--font-display` | **Fraunces** (Google Fonts) | Italic serif. Section headings, quotes, page titles. Carries Portuguese diacritics. |
| `--font-body` | **Plus Jakarta Sans** (Google Fonts) | UI, buttons, captions, body. Weights 300–700. |

### Backgrounds
Page background is the paper cream, full bleed. **No gradient meshes, no patterns.** Cards lift slightly above the cream on `--surface` (`#FAF6EC`). The optional **black-silhouette illustration** style (see image 1, 2 references) is the brand's marketing surface treatment — used on story templates and hero pages, never inside the product chrome.

### Animation
Two named keyframes, both ~220ms `ease-out`:
- `fadeSlideIn` — tab switches, 8px up
- `slideInRight` — panels, 24px right

No bouncy springs, no scroll-triggered effects, no page-load chains.

### Hover & press
- **Card hover**: border goes `--border` → `--border-strong`. No lift, no shadow shift.
- **Primary CTA hover**: coral → darker coral (`--accent-hover`).
- **Soft button hover**: `accent-light` ↔ `accent` swap (bg + text invert).
- **Icon button hover**: `--text-faint` → `--accent` (or `--red` for destructive).
- **Disabled**: bg → `--border`, text → `--text-faint`. No opacity tricks.

### Borders & shadows
Every card uses `1px solid var(--border)` + soft `--shadow-sm`. Active inputs swap to `1.5px solid var(--accent)`. Three shadow tokens — `sm`, `md`, `lg` — never mix within one surface. The **coral CTA glow** `0 2px 12px rgba(232,75,42,0.28)` only appears on filled-coral buttons and the active tab pill.

### Layout
Mobile-first; bottom nav (7 tabs, emoji + tiny label) appears under `md:`. Desktop replaces it with a sticky top header (logo + segmented 7-tab nav + avatar). Page content is column-centered: `max-w-2xl` for focused pages, `max-w-5xl` for Home with sidebar.

### Corner radii
Four radii: `sm 8`, `md 14` (default), `lg 20` (entry cards), `2xl 24` (modals), plus `pill` for chips. Always confident — never less than 8px on anything bigger than a tag.

### Transparency & blur
Used twice:
- **Floating canvas toolbar** — `rgba(250,246,236,0.85)` + `backdrop-filter: blur(12px)`.
- **Modal backdrop** — `rgba(15,14,20,0.78)` + `backdrop-filter: blur(10px)` (deep ink).

### Imagery
The brand's marketing surfaces use **black-silhouette editorial illustrations** on cream — figures in flat black, a single coral pop (a brain, a lightbulb), thin pencil-line accents, small dieline-style markers in the corners ("nr. 0399", "11/22", etc — see references). Inside the product chrome, imagery is minimal: the user's uploads only.

---

## Iconography

Mind Space uses **Lucide React** as its sole icon family (sizes 10–22, stroke width 2). Icons take `color: var(--text-faint)` at rest and step to `var(--accent)` on hover. They never carry their own background — an icon needing a chip sits inside a rounded square at `--surface-2`.

No custom icon font or sprite. The UI kit ships hand-extracted Lucide path data so the kit is dependency-free; for production code, import directly from `lucide-react`.

Emoji are **category glyphs only** (one per category, fixed) and decorative punctuation in empty states (✨ 💜 🌿). Buttons always use Lucide, never emoji.

### Logo / brand mark
The mark is a **brain-tree silhouette** — a symmetric lobed brain with a slight tree-trunk taper at the base, drawn as overlapping circle primitives that fuse into a single coral form (see `assets/mark.svg`). It combines three references from image 4: **neurons** (the round cell-body lobes), **tree** (growth, vertical pull, the small trunk), and **brain** (the cerebral silhouette and hemisphere divider). Always rendered solid, in `--accent` coral (or `--text` ink for monochrome contexts).

The wordmark to its right is "Mind Space" set in **Nauryz Redkeds** — the uploaded brand TTF — at 1× the mark height. Fallback stack: `Nauryz Redkeds → Anton → Fraunces → serif`. See `assets/logo.html` for the live HTML wordmark and `assets/logo.svg` for an export-safe SVG version (uses Anton as fallback since most SVG viewers don't load custom TTFs).

---

## Files in this folder

```
README.md                 — this file
SKILL.md                  — Agent-Skill manifest, makes this folder portable
colors_and_type.css       — all design tokens (color, type, spacing, radius, shadow, motion)
fonts/                    — uploaded brand TTFs
  nauryzredkeds.ttf       — wordmark-only display font (no PT diacritics)
assets/                   — mark + logo (SVG and live-HTML)
preview/                  — small cards rendered in the Design System tab
ui_kits/
  mind-space/             — interactive recreation of the product
    README.md             — kit overview
    index.html            — interactive prototype
    *.jsx                 — modular React components
```

## Index

- **Tokens** → `colors_and_type.css`
- **Voice / copy** → top of this file
- **Components & screens** → `ui_kits/mind-space/`
- **Visual review** → the Design System tab (every `preview/*.html` is registered)
- **Skill for Claude Code** → `SKILL.md`
