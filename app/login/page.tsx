'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'

function LoginForm() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle')
  const [error, setError] = useState(
    errorParam === 'expired' ? 'Link expirado. Solicite um novo abaixo.' :
    errorParam === 'invalid' ? 'Link invalido. Use o link mais recente.' : ''
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus('sent')
    } catch {
      setError('Falha de conexao. Tente novamente.')
      setStatus('idle')
    }
  }

  return (
    <>
      <main className="mx-auto w-full max-w-editorial px-5 py-16 md:px-grid-margin md:py-20">
        <div className="mx-auto max-w-lg">
          <header className="mb-10">
            <p className="brand-kicker mb-5">acesso premium</p>
            <h1 className="brand-poster text-5xl md:text-7xl">Entrar no Pulso.</h1>
            <p className="mt-5 font-display text-xl italic leading-relaxed text-muted">
              Digite seu email e enviaremos um link de acesso instantaneo.
            </p>
          </header>

          {status === 'sent' ? (
            <div className="brand-card p-8">
              <p className="brand-kicker mb-4">enviado</p>
              <h2 className="font-display text-3xl italic text-text">Verifique seu email.</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Se <strong className="text-text">{email}</strong> for uma assinatura premium ativa, voce recebera o link em instantes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="brand-card flex flex-col gap-6 p-8">
              <div>
                <label htmlFor="email" className="meta-label mb-2 block">Email da assinatura</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-md border border-border bg-bg px-4 py-3 font-display text-lg italic text-text outline-none placeholder:text-faint focus:border-accent"
                />
              </div>
              {error && <p className="font-body text-sm font-bold text-red-700">{error}</p>}
              <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:bg-border disabled:text-faint">
                {status === 'loading' ? 'Enviando...' : 'Enviar link de acesso'}
              </button>
              <p className="text-sm leading-relaxed text-muted">
                Ainda nao e assinante?{' '}
                <Link href="/signup" className="font-bold text-accent hover:text-accent-hover">
                  Criar conta Premium
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
