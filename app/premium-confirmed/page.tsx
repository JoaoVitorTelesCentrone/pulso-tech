import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PremiumConfirmedPage() {
  return (
    <>
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-24 min-h-[60vh] flex flex-col justify-center">
        <div className="max-w-lg">
          <p className="font-dm-mono text-[0.65rem] tracking-[0.2em] uppercase mb-6" style={{ color: '#C9FF47' }}>
            Premium ativo
          </p>

          <h1 className="font-syne font-extrabold text-ink leading-[0.9] tracking-[-0.04em] text-4xl md:text-5xl mb-8">
            Bem-vindo ao Tech&amp;Future Premium
          </h1>

          <div className="w-12 h-px mb-8" style={{ background: '#C9FF47' }} />

          <p className="font-cormorant font-light text-muted text-xl leading-relaxed mb-4">
            Sua assinatura está ativa. Você agora tem acesso completo aos slides e carrosseis de cada edição,
            além de receber o digest diário prioritário às 06h BRT.
          </p>

          <p className="font-cormorant font-light text-muted text-lg leading-relaxed mb-10">
            Os primeiros 7 dias são gratuitos. Nenhum valor será cobrado até o fim do período de teste.
          </p>

          <div className="flex flex-wrap gap-8">
            <Link
              href="/"
              className="inline-block font-dm-mono text-[0.65rem] tracking-[0.12em] uppercase text-ink border-b border-ink pb-0.5 hover:text-muted hover:border-muted transition-colors"
            >
              Ver edição de hoje →
            </Link>
            <Link
              href="/subscribe"
              className="inline-block font-dm-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted hover:text-ink transition-colors"
            >
              Gerenciar assinatura
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
