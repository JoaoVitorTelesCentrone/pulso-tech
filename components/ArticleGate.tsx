'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, Sparkles } from 'lucide-react'

export function ArticleGate() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro')
        setLoading(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError('Falha de conexao.')
      setLoading(false)
    }
  }

  return (
    <div className="relative -mx-6 mt-8 md:-mx-0">
      <div
        className="pointer-events-none absolute -top-32 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }}
      />

      <div className="dieline rounded-xl bg-text px-8 py-10 text-bg shadow-md md:px-12 md:py-12">
        <div className="mb-6 flex items-center gap-2">
          <Lock size={14} className="text-accent" strokeWidth={2} />
          <span className="font-body text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">
            Conteudo Premium
          </span>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-16">
          <div className="flex-1">
            <h2 className="brand-poster mb-4 text-4xl text-bg md:text-5xl">
              A analise completa<br />e para assinantes.
            </h2>
            <p className="mb-4 font-display text-lg italic leading-relaxed text-[#B8B3A0]">
              Voce leu o contexto. O restante aprofunda dados, impacto de mercado e sinais para acompanhar.
            </p>
            <Link href="/login" className="font-body text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#B8B3A0] hover:text-bg">
              Ja sou assinante - entrar
            </Link>
          </div>

          <div className="w-full flex-shrink-0 md:w-80">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={12} className="text-accent" strokeWidth={2} />
              <span className="font-body text-[0.65rem] font-bold uppercase tracking-[0.15em] text-accent">
                7 dias gratis
              </span>
            </div>
            <form onSubmit={handleCheckout} className="flex flex-col gap-3">
              <div className="flex rounded-md border border-[#46424F] bg-[#1A1820] px-4 py-2 transition-colors focus-within:border-accent">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full border-none bg-transparent font-display text-lg italic text-bg placeholder:text-[#6D6A60] focus:outline-none focus:ring-0"
                />
              </div>
              {error && (
                <p className="font-body text-[0.7rem] font-bold tracking-[0.08em] text-red-300">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:bg-[#46424F] disabled:text-[#6D6A60]"
              >
                {loading ? 'Aguarde...' : 'Assinar e continuar'}
              </button>
            </form>
            <p className="mt-3 font-body text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#6D6A60]">
              Cancele quando quiser - sem fidelidade
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
