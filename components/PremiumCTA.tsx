'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function PremiumCTA() {
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
    <aside className="dieline -mx-6 mt-16 rounded-xl bg-text px-8 py-10 text-bg shadow-md md:-mx-0 md:px-12 md:py-12">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles size={14} className="text-accent" strokeWidth={2} />
        <span className="font-body text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">
          Pulso Premium
        </span>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-end md:gap-16">
        <div className="flex-1">
          <h2 className="brand-poster mb-4 text-4xl text-bg md:text-5xl">
            Gostou da analise?<br />Va mais fundo.
          </h2>
          <p className="font-display text-lg italic leading-relaxed text-[#B8B3A0]">
            Slides prontos, carrosseis para LinkedIn e o digest diario as 06h -
            tudo por <span className="text-bg">R$ 29,90/mes</span>. Primeira semana gratis.
          </p>
        </div>

        <div className="w-full flex-shrink-0 md:w-80">
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
              {loading ? 'Aguarde...' : 'Comecar semana gratis'}
            </button>
          </form>
          <p className="mt-3 font-body text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#6D6A60]">
            Ja assinante?{' '}
            <Link href="/subscribe" className="border-b border-[#46424F] text-[#B8B3A0] transition-colors hover:text-bg">
              Gerencie sua conta
            </Link>
          </p>
        </div>
      </div>
    </aside>
  )
}
