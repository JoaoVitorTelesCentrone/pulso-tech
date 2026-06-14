import type { Metadata } from 'next'
import { Syne, Cormorant_Garamond, DM_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tech&Future',
  description:
    'Análises, ferramentas e reflexões sobre inteligência artificial, produto e o que significa trabalhar com tecnologia com intenção.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${syne.variable} ${cormorant.variable} ${dmMono.variable} bg-cream text-ink font-syne overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  )
}
