'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { Home, Archive, Sparkles, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/archive', label: 'Arquivo', Icon: Archive },
  { href: '/subscribe', label: 'Premium', Icon: Sparkles },
  { href: '/about', label: 'Sobre', Icon: Info },
]

export function MobileDock() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden"
      aria-label="Navegação principal mobile"
    >
      <div
        className="bg-ink/[0.97] backdrop-blur-md border-t border-white/10"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <ul className="flex items-center justify-around h-[60px] list-none m-0 p-0 px-1">
          {items.map(({ href, label, Icon }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className="flex flex-col items-center justify-center gap-[3px] h-full w-full min-h-[44px] relative"
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dock-active-pill"
                      className="absolute inset-x-2 top-1.5 h-[3px] bg-electric rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.div whileTap={{ scale: 0.8 }} className="flex flex-col items-center gap-[3px]">
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      className={cn(
                        'transition-colors duration-200',
                        isActive ? 'text-electric' : 'text-warm-gray'
                      )}
                    />
                    <span
                      className={cn(
                        'font-dm-mono text-[0.48rem] tracking-[0.1em] uppercase leading-none transition-colors duration-200',
                        isActive ? 'text-electric' : 'text-muted'
                      )}
                    >
                      {label}
                    </span>
                  </motion.div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
