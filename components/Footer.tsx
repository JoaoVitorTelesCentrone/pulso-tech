import Link from 'next/link'
import { PulsoMark } from './PulsoMark'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-text text-bg">
      <div className="mx-auto flex w-full max-w-editorial flex-col gap-10 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-12">
        <div>
          <Link href="/" className="mb-6 flex items-center gap-3 leading-none">
            <PulsoMark inverted className="h-10" />
            <div className="flex flex-col">
              <span className="font-brand text-2xl leading-none text-bg">Pulso</span>
              <span className="font-body text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#B8B3A0]">tech</span>
            </div>
          </Link>
          <p className="max-w-sm font-display text-lg italic leading-relaxed text-[#F2EDDF]">
            O ritmo da inteligencia artificial sem o ruido.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#B8B3A0] hover:text-bg">
              Privacidade
            </Link>
            <Link href="/terms" className="font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#B8B3A0] hover:text-bg">
              Termos
            </Link>
          </div>
          <p className="font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#6D6A60]">
            nr. 001 - pulso tech - {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
