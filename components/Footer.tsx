import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-[#2a2a28]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-12 py-10 w-full max-w-editorial mx-auto gap-8 flex-wrap">

        {/* Logo */}
        <Link href="/" className="flex items-baseline leading-none">
          <span className="font-syne font-extrabold text-white text-[1.4rem] tracking-[-0.04em]">Tech</span>
          <span className="font-cormorant italic font-light text-electric text-[1.5rem] px-[0.15em]">&</span>
          <span className="font-syne font-extrabold text-white text-[1.4rem] tracking-[-0.04em]">Future</span>
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
          JV Centrone · Tech&amp;Future · 2026
        </p>
      </div>
    </footer>
  )
}
