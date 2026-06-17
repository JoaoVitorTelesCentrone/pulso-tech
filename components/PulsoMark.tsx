import { cn } from '@/lib/utils'

type Props = {
  className?: string
  inverted?: boolean
}

export function PulsoMark({ className, inverted = false }: Props) {
  const ink = inverted ? '#F2EDDF' : '#0F0E14'
  const accent = inverted ? '#FF6B49' : '#E84B2A'

  return (
    <svg
      viewBox="0 0 340 240"
      className={cn('h-10 w-auto', className)}
      aria-hidden="true"
      focusable="false"
    >
      <g transform="rotate(-12 170 120)">
        <ellipse
          cx="170"
          cy="120"
          rx="140"
          ry="48"
          fill="none"
          stroke={ink}
          strokeWidth="14"
          strokeLinecap="round"
        />
      </g>
      <circle cx="170" cy="120" r="34" fill={ink} />
      <path
        d="M 14 120 L 92 120 L 110 78 L 132 162 L 152 64 L 188 176 L 208 64 L 230 162 L 250 80 L 268 120 L 326 120"
        stroke={accent}
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 285 32 L 290 50 L 308 55 L 290 60 L 285 78 L 280 60 L 262 55 L 280 50 Z"
        fill={ink}
      />
    </svg>
  )
}
