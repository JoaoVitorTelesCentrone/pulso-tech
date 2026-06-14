/**
 * Brand-aligned image prompt system for TechPulse editorial.
 *
 * Visual identity:
 *   ink    #0D0D0B  — primary background
 *   cream  #F4F0E8  — body text / secondary surfaces
 *   electric #C9FF47 — neon accent, used sparingly
 *
 * Aesthetic: dark editorial tech — cinematic, minimal, no clutter.
 */

export interface ImagePromptConfig {
  base_style: string;
  mood: string;
  technical: string;
  negative: string;
}

export const BRAND_IMAGE_CONFIG: ImagePromptConfig = {
  base_style:
    'editorial dark technology photography, deep ink-black background, ' +
    'single sharp neon-lime accent light, geometric minimalist composition, ' +
    'cinematic depth of field, strong negative space, high contrast',
  mood:
    'sophisticated premium tech magazine cover, serious and authoritative, ' +
    'no gimmicks, clean and precise like a printed editorial spread',
  technical:
    'photorealistic render or high-end photography, sharp focus, ' +
    '16:9 horizontal landscape, no text, no logos, no watermarks',
  negative:
    'cartoonish, colorful rainbow palette, bright white background, ' +
    'stock photo clichés, people faces, clutter, gradient rainbow, ' +
    'low quality, blurry, watermark, text overlay, UI elements',
};

const TAG_VISUAL_MAP: Record<string, string> = {
  'inteligência artificial': 'abstract neural network nodes floating in dark space',
  ia: 'abstract neural network nodes floating in dark space',
  'machine learning': 'flowing data streams forming a lattice structure',
  llm: 'text fragments dissolving into light particles',
  robótica: 'sleek mechanical arm in a dark workshop',
  quantum: 'quantum circuit patterns with glowing qubits',
  segurança: 'dark server room with a single electric beam cutting through',
  cibersegurança: 'translucent digital lock suspended in void',
  startup: 'minimal desk with a single glowing monitor in darkness',
  investimento: 'abstract upward geometric lines in neon-lime on black',
  hardware: 'extreme macro of circuit board traces with neon backlighting',
  chip: 'extreme macro of processor die under dark blue-green light',
  software: 'cascading lines of code dissolving into light',
  open_source: 'branching tree structure in wireframe on black background',
  metaverso: 'fragmented geometric space floating in a dark void',
  blockchain: 'interconnected hexagonal nodes in a dark field',
};

function resolveVisualSubject(tags: string[]): string {
  const normalized = tags.map((t) => t.toLowerCase().replace(/[^a-záéíóúãõâêô_ ]/g, ''));
  for (const tag of normalized) {
    const key = Object.keys(TAG_VISUAL_MAP).find((k) => tag.includes(k));
    if (key) return TAG_VISUAL_MAP[key];
  }
  return 'abstract technology concept with glowing geometric shapes in dark void';
}

/**
 * Builds a complete, brand-aligned prompt for image generation.
 * @param title  Article title — used for context, not literally rendered
 * @param tags   Article tags — drives the visual subject selection
 */
export function buildImagePrompt(title: string, tags: string[] = []): string {
  const subject = resolveVisualSubject(tags);
  const { base_style, mood, technical } = BRAND_IMAGE_CONFIG;
  return `${subject}, ${base_style}, ${mood}, ${technical}. Context: ${title}`;
}

/**
 * Returns the negative prompt string for APIs that accept it separately.
 */
export function getNegativePrompt(): string {
  return BRAND_IMAGE_CONFIG.negative;
}
