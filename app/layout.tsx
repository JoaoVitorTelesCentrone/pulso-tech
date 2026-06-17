import type { Metadata } from 'next'
import { Anton, Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import { MobileDock } from '@/components/ui/mobile-dock'
import { TopLoader } from '@/components/TopLoader'
import Header from '@/components/Header'
import { cookies } from 'next/headers'
import { verifyAccessToken, ACCESS_COOKIE } from '@/lib/auth'
import './globals.css'

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-headline',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
})

const brand = localFont({
  src: './Pulso Tech brand identity/_ds/mind-space-design-system-019e1d1e-2d72-7729-aec8-b3e98d69f760/fonts/nauryzredkeds.ttf',
  variable: '--font-brand',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pulso Tech',
  description:
    'O ritmo da inteligencia artificial sem o ruido. Analises de IA e tecnologia em portugues.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const token = cookieStore.get(ACCESS_COOKIE.name)?.value
  const access = token ? await verifyAccessToken(token) : null
  const isPremium = access?.plan === 'premium'

  return (
    <html lang="pt-BR" data-theme="light">
      <body
        className={`${anton.variable} ${fraunces.variable} ${jakarta.variable} ${brand.variable} bg-bg text-text font-body overflow-x-hidden pb-[60px] md:pb-0`}
      >
        <TopLoader />
        <Header isPremium={isPremium} />
        {children}
        <MobileDock isPremium={isPremium} />
      </body>
    </html>
  )
}
