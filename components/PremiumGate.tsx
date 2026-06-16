'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PremiumGate({ articleTitle }: { articleTitle: string }) {
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
    <div className="w-full border-t border-warm-gray pt-12 mt-4">
      {/* Blurred preview hint */}
      <div className="relative mb-10 overflow-hidden rounded-sm select-none pointer-events-none" style={{ height: 180 }}>
        <div className="opacity-30 blur-sm scale-95 origin-top">
          <div className="grid grid-cols-3 gap-2">
            {['#0D0D0B', '#F4F0E8', '#C9FF47'].map((bg, i) => (
              <div key={i} className="aspect-square rounded-sm" style={{ background: bg }} />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-cream/70">
          <span className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted">
            Conteúdo Premium
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-lg">
        <p className="font-dm-mono text-[0.6rem] tracking-[0.18em] uppercase mb-3" style={{ color: '#C9FF47', filter: 'brightness(0.7)' }}>
          Tech&amp;Future Premium
        </p>

        <h2 className="font-syne font-extrabold text-ink leading-tight tracking-[-0.03em] text-2xl mb-4">
          Slides e carrosseis são exclusivos para assinantes Premium
        </h2>

        <p className="font-cormorant font-light text-muted text-lg leading-relaxed mb-8">
          Assine por <strong className="text-ink">R$ 29,90/mês</strong> e acesse os slides e carrosseis prontos para usar
          de cada edição — além do digest diário prioritário às 06h.
          Primeira semana grátis, cancele quando quiser.
        </p>

        <form onSubmit={handleCheckout} className="flex flex-col gap-4 mb-6">
          <div className="flex border-b border-ink py-2">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-transparent border-none w-full focus:ring-0 focus:outline-none font-cormorant text-ink text-lg placeholder:text-warm-gray"
            />
            <button
              type="submit"
              disabled={loading}
              className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-ink hover:text-muted transition-colors px-4 flex-shrink-0 disabled:opacity-50"
            >
              {loading ? '...' : 'Assinar →'}
            </button>
          </div>
          {error && <p className="font-dm-mono text-[0.6rem] text-red-600 tracking-[0.08em]">{error}</p>}
        </form>

        <p className="font-dm-mono text-[0.6rem] tracking-[0.1em] uppercase text-muted">
          Já assinante?{' '}
          <Link href="/subscribe" className="text-ink hover:text-muted transition-colors border-b border-ink">
            Gerencie sua assinatura
          </Link>
        </p>
      </div>
    </div>
  )
}
