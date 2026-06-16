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
      if (!res.ok) { setError(data.error || 'Erro'); setLoading(false); return }
      window.location.href = data.url
    } catch {
      setError('Falha de conexão.')
      setLoading(false)
    }
  }

  return (
    <aside className="bg-ink -mx-6 md:-mx-0 mt-16 px-8 md:px-12 py-10 md:py-12">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={12} className="text-electric" strokeWidth={1.5} />
        <span className="font-dm-mono text-[0.6rem] tracking-[0.2em] uppercase text-electric">
          Pulso Premium
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
        {/* Copy */}
        <div className="flex-1">
          <h2 className="font-syne font-extrabold text-white leading-[0.95] tracking-[-0.03em] text-2xl md:text-3xl mb-4">
            Gostou da análise?<br />Vá mais fundo com o Premium.
          </h2>
          <p className="font-cormorant font-light text-warm-gray text-lg leading-relaxed">
            Slides prontos, carrosseis para LinkedIn e o digest diário às 06h —
            tudo por <span className="text-white font-normal">R$ 29,90/mês</span>.{' '}
            Primeira semana grátis, cancele quando quiser.
          </p>
        </div>

        {/* Form */}
        <div className="w-full md:w-80 flex-shrink-0">
          <form onSubmit={handleCheckout} className="flex flex-col gap-3">
            <div className="flex border-b border-white/20 py-2 focus-within:border-electric transition-colors">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="bg-transparent border-none w-full focus:ring-0 focus:outline-none font-cormorant text-white text-lg placeholder:text-white/30"
              />
            </div>
            {error && (
              <p className="font-dm-mono text-[0.58rem] text-red-400 tracking-[0.08em]">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-electric text-ink font-syne font-semibold text-[0.75rem] tracking-[0.12em] uppercase py-3 hover:bg-white transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Aguarde...' : 'Começar semana grátis →'}
            </button>
          </form>
          <p className="mt-3 font-dm-mono text-[0.55rem] tracking-[0.1em] uppercase text-white/30">
            Já assinante?{' '}
            <Link href="/subscribe" className="text-white/50 hover:text-white transition-colors border-b border-white/20">
              Gerencie sua conta
            </Link>
          </p>
        </div>
      </div>
    </aside>
  )
}
