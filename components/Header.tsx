'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/archive', label: 'Arquivo' },
  { href: '/subscribe', label: 'Assinar' },
  { href: '/about', label: 'Sobre' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-warm-gray">
      <div className="flex justify-between items-center px-6 md:px-grid-margin py-4 w-full max-w-editorial mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 leading-none group">
          <span
            className="inline-block w-2 h-2 rounded-full bg-electric transition-transform duration-300 group-hover:scale-125"
            aria-hidden
          />
          <span className="font-syne font-extrabold text-ink text-[1.35rem] tracking-[-0.04em]">
            Pulso
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`font-dm-mono text-[0.65rem] tracking-[0.12em] uppercase transition-colors duration-200 ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile — label */}
        <span className="md:hidden font-dm-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted">
          Editorial
        </span>
      </div>
    </nav>
  )
}
