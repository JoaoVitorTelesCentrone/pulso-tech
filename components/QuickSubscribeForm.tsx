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
      <p className="brand-card px-5 py-4 font-display text-lg italic text-text">
        Verifique seu email para confirmar a assinatura.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex flex-col gap-2">
        <label htmlFor="newsletter-email" className="meta-label">
          Seu email profissional
        </label>
        <div className="flex rounded-md border border-border bg-surface px-4 py-2 shadow-sm transition-colors focus-within:border-accent">
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border-none bg-transparent font-display text-lg italic text-text placeholder:text-faint focus:outline-none focus:ring-0"
            placeholder="nome@companhia.com.br"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex-shrink-0 rounded-sm px-4 font-body text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-accent transition-colors hover:text-accent-hover disabled:text-faint"
          >
            {status === 'loading' ? '...' : 'Assinar'}
          </button>
        </div>
        {status === 'error' && (
          <p className="font-body text-[0.7rem] font-bold tracking-[0.08em] text-red-700">
            Erro ao inscrever. Tente novamente ou acesse /subscribe.
          </p>
        )}
      </div>
    </form>
  )
}
