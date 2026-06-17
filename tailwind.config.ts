import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-hover': 'var(--surface-hover)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        text: 'var(--text)',
        muted: 'var(--text-muted)',
        faint: 'var(--text-faint)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-light': 'var(--accent-light)',
        depth: 'var(--depth)',
        ink: 'var(--text)',
        cream: 'var(--bg)',
        paper: 'var(--surface-2)',
        'warm-gray': 'var(--border)',
        electric: 'var(--accent)',
        background: 'var(--bg)',
      },
      borderRadius: {
        DEFAULT: '0.875rem',
        sm: '0.5rem',
        md: '0.875rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
      spacing: {
        'grid-margin': '4rem',
        'grid-gutter': '1.5rem',
        'section-gap': '8rem',
        'stack-sm':    '0.5rem',
        'stack-md':    '1.5rem',
      },
      fontFamily: {
        brand: ['var(--font-brand)', 'Anton', 'serif'],
        headline: ['var(--font-headline)', 'Arial Narrow', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        syne: ['var(--font-headline)', 'Arial Narrow', 'sans-serif'],
        cormorant: ['var(--font-display)', 'Georgia', 'serif'],
        'dm-mono': ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(4rem, 12vw, 10.5rem)', { lineHeight: '0.86', letterSpacing: '0', fontWeight: '400' }],
        'headline-lg': ['64px', { lineHeight: '0.92', fontWeight: '400' }],
        'headline-md': ['36px', { lineHeight: '1.05', fontWeight: '400' }],
        'body-lg':     ['20px',  { lineHeight: '1.8',  fontWeight: '300' }],
        'body-md':     ['18px',  { lineHeight: '1.8',  fontWeight: '300' }],
        'label-sm':    ['11px',  { lineHeight: '1',    letterSpacing: '0.18em', fontWeight: '400' }],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        accent: 'var(--accent-shadow)',
      },
      maxWidth: {
        editorial: '1440px',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body':         '#0D0D0B',
            '--tw-prose-headings':     '#0D0D0B',
            '--tw-prose-links':        '#0D0D0B',
            '--tw-prose-bold':         '#0D0D0B',
            '--tw-prose-counters':     '#7A7670',
            '--tw-prose-bullets':      '#7A7670',
            '--tw-prose-hr':           '#C8C3B8',
            '--tw-prose-quotes':       '#0D0D0B',
            '--tw-prose-quote-borders':'#C8C3B8',
            '--tw-prose-captions':     '#7A7670',
            '--tw-prose-code':         '#0D0D0B',
            '--tw-prose-pre-code':     '#0D0D0B',
            '--tw-prose-pre-bg':       '#EDE8DC',
            '--tw-prose-th-borders':   '#C8C3B8',
            '--tw-prose-td-borders':   '#C8C3B8',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
