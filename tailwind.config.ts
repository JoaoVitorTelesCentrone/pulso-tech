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
        ink:         '#0D0D0B',
        cream:       '#F4F0E8',
        paper:       '#EDE8DC',
        'warm-gray': '#C8C3B8',
        muted:       '#7A7670',
        electric:    '#FF3D00',
        // body defaults
        background:  '#F4F0E8',
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
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
        syne:      ['var(--font-syne)', 'sans-serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        'dm-mono': ['var(--font-dm-mono)', 'monospace'],
      },
      fontSize: {
        'display-xl':  ['72px',  { lineHeight: '0.9',  letterSpacing: '-0.04em', fontWeight: '800' }],
        'headline-lg': ['48px',  { lineHeight: '1.0',  fontWeight: '800' }],
        'headline-md': ['32px',  { lineHeight: '1.1',  fontWeight: '700' }],
        'body-lg':     ['20px',  { lineHeight: '1.8',  fontWeight: '300' }],
        'body-md':     ['18px',  { lineHeight: '1.8',  fontWeight: '300' }],
        'label-sm':    ['11px',  { lineHeight: '1',    letterSpacing: '0.18em', fontWeight: '400' }],
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
