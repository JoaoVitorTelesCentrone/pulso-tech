'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/archive', label: 'Arquivo' },
  { href: '/subscribe', label: 'Assinar' },
  { href: '/about', label: 'Sobre' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-warm-gray">
      <div className="flex justify-between items-center px-6 md:px-grid-margin py-4 w-full max-w-editorial mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-baseline leading-none">
          <span className="font-syne font-extrabold text-ink text-[1.4rem] tracking-[-0.04em]">Tech</span>
          <span className="font-cormorant italic font-light text-ink text-[1.5rem] px-[0.15em]">&</span>
          <span className="font-syne font-extrabold text-ink text-[1.4rem] tracking-[-0.04em]">Future</span>
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

        {/* Mobile toggle */}
        <button
          className="md:hidden font-dm-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted hover:text-ink transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileOpen ? '✕' : '≡ Menu'}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-cream border-t border-warm-gray px-6 py-6 flex flex-col gap-5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`font-dm-mono text-[0.65rem] tracking-[0.12em] uppercase transition-colors ${
                pathname === href ? 'text-ink' : 'text-muted'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
