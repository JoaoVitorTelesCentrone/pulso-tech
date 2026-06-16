import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ConfirmedPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const isAlready = searchParams.status === 'already'
  const isInvalid = searchParams.status === 'invalid'

  return (
    <>
      <Header />
      <main className="max-w-editorial mx-auto px-6 md:px-grid-margin py-24 min-h-[60vh] flex flex-col justify-center">
        <div className="max-w-lg">
          <p className="font-dm-mono text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-6">
            {isInvalid || isAlready ? 'Atenção' : 'Confirmado'}
          </p>

          <h1 className="font-syne font-extrabold text-ink leading-[0.9] tracking-[-0.04em] text-4xl md:text-5xl mb-8">
            {isInvalid
              ? 'Link inválido'
              : isAlready
              ? 'Já confirmado'
              : 'Bem-vindo ao Pulso'}
          </h1>

          <div className="w-12 h-px bg-electric mb-8" />

          <p className="font-cormorant font-light text-muted text-xl leading-relaxed mb-10">
            {isInvalid
              ? 'Este link de confirmação não é válido ou expirou. Tente se inscrever novamente.'
              : isAlready
              ? 'Seu email já estava confirmado. Você já receberá as edições diárias.'
              : 'Sua assinatura está ativa. A partir de hoje você receberá o Pulso — digest diário de tecnologia e IA — às 06h BRT.'}
          </p>

          <Link
            href="/"
            className="inline-block font-dm-mono text-[0.65rem] tracking-[0.12em] uppercase text-ink hover:text-muted transition-colors"
          >
            ← Ir para o blog
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
