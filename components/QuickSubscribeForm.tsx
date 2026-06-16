'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function QuickSubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang: 'pt' }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="font-cormorant font-light text-ink text-lg">
        Verifique seu email para confirmar a assinatura.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex flex-col gap-2">
        <label htmlFor="newsletter-email" className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted">
          Seu Email Profissional
        </label>
        <div className="flex border-b border-ink py-2">
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-transparent border-none w-full focus:ring-0 focus:outline-none font-cormorant text-ink text-lg placeholder:text-warm-gray"
            placeholder="nome@companhia.com.br"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-ink hover:text-muted transition-colors px-4 flex-shrink-0 disabled:opacity-50"
          >
            {status === 'loading' ? '...' : 'Assinar'}
          </button>
        </div>
        {status === 'error' && (
          <p className="font-dm-mono text-[0.6rem] text-red-600 tracking-[0.08em]">
            Erro ao inscrever. Tente novamente ou acesse /subscribe.
          </p>
        )}
      </div>
    </form>
  )
}
