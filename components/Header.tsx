'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, User } from 'lucide-react'
import { PulsoMark } from './PulsoMark'

const navLinks = [
  { href: '/resumo-do-dia', label: 'Resumo' },
  { href: '/archive', label: 'Arquivo' },
  { href: '/about', label: 'Sobre' },
]

type Props = { isPremium?: boolean }

export default function Header({ isPremium }: Props) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-editorial items-center justify-between px-5 py-3 md:px-grid-margin">
        <Link href="/" className="group flex items-center gap-3 leading-none" aria-label="Pulso Tech">
          <PulsoMark className="h-8 transition-transform duration-200 group-hover:-rotate-3" />
          <div className="flex flex-col">
            <span className="font-brand text-[1.45rem] leading-none text-text">Pulso</span>
            <span className="brand-meta -mt-0.5 text-[0.52rem] tracking-[0.16em]">tech</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-border bg-surface p-1 shadow-sm md:flex" aria-label="Navegacao principal">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 font-body text-[0.68rem] font-extrabold uppercase tracking-[0.12em] transition-colors ${
                  isActive ? 'bg-accent text-bg shadow-accent' : 'text-muted hover:bg-surface-2 hover:text-text'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isPremium && (
            <Link href="/signup" className="btn-soft py-2">
              Criar conta
            </Link>
          )}
          <Link href={isPremium ? '/minha-conta' : '/login'} className="btn-ink py-2">
            {isPremium ? <User size={14} /> : <LogIn size={14} />}
            {isPremium ? 'Conta' : 'Entrar'}
          </Link>
        </div>

        <span className="md:hidden brand-meta">
          {isPremium ? 'premium' : 'editorial'}
        </span>
      </div>
    </header>
  )
}
