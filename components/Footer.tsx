import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-[#2a2a28]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-12 py-10 w-full max-w-editorial mx-auto gap-8 flex-wrap">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 leading-none group">
          <span
            className="inline-block w-2 h-2 rounded-full bg-electric transition-transform duration-300 group-hover:scale-125"
            aria-hidden
          />
          <span className="font-syne font-extrabold text-white text-[1.35rem] tracking-[-0.04em]">
            Pulso
          </span>
        </Link>

        {/* Links */}
        <div className="flex flex-wrap gap-6">
          <Link
            href="/privacy"
            className="font-dm-mono text-[0.6rem] tracking-[0.1em] uppercase text-muted hover:text-white transition-colors"
          >
            Política de Privacidade
          </Link>
          <Link
            href="/terms"
            className="font-dm-mono text-[0.6rem] tracking-[0.1em] uppercase text-muted hover:text-white transition-colors"
          >
            Termos de Uso
          </Link>
        </div>

        {/* Meta */}
        <p className="font-dm-mono text-[0.6rem] tracking-[0.1em] leading-relaxed text-muted text-right">
          Syne · Cormorant Garamond · DM Mono<br />
          JV Centrone · Pulso · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
