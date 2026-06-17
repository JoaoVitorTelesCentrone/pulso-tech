import Link from 'next/link'
import Footer from '@/components/Footer'

export default function ConfirmedPage({ searchParams }: { searchParams: { status?: string } }) {
  const isAlready = searchParams.status === 'already'
  const isInvalid = searchParams.status === 'invalid'

  return (
    <>
      <main className="mx-auto flex min-h-[62vh] w-full max-w-editorial items-center px-5 py-16 md:px-grid-margin">
        <section className="dieline max-w-2xl rounded-2xl bg-surface p-8 shadow-sm md:p-12">
          <p className="brand-kicker mb-5">{isInvalid || isAlready ? 'atencao' : 'confirmado'}</p>
          <h1 className="brand-poster text-5xl md:text-7xl">
            {isInvalid ? 'Link invalido.' : isAlready ? 'Ja confirmado.' : 'Bem-vindo ao Pulso.'}
          </h1>
          <p className="mt-6 font-display text-2xl italic leading-snug text-muted">
            {isInvalid
              ? 'Este link de confirmacao nao e valido ou expirou. Tente se inscrever novamente.'
              : isAlready
              ? 'Seu email ja estava confirmado. Voce recebera os proximos sinais.'
              : 'Sua assinatura esta ativa. A partir de agora voce recebera os novos posts por email.'}
          </p>
          <Link href="/" className="btn-soft mt-8">Ir para o blog</Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
