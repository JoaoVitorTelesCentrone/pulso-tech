'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'

const BENEFITS = [
  'Analise completa de cada artigo',
  'Resumo diario com fatos-chave e contexto',
  'Slides prontos por edicao',
  'Carrosseis para LinkedIn',
  'Emails quando novos posts forem gerados',
]

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
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
        setError(data.error || 'Erro ao iniciar checkout.')
        setLoading(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError('Falha de conexao. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <>
      <main className="mx-auto w-full max-w-editorial px-5 py-12 md:px-grid-margin md:py-16">
        <section className="grid gap-10 md:grid-cols-[1fr_0.9fr] md:items-start">
          <div>
            <p className="brand-kicker mb-5">pulso premium</p>
            <h1 className="brand-poster max-w-3xl text-6xl md:text-display-xl">
              Leia o que importa.
            </h1>
            <p className="mt-6 max-w-xl font-display text-2xl italic leading-snug text-muted">
              Analise profunda de tecnologia, IA e economia - direto no seu email e no Pulso.
            </p>

            <div className="mt-10 grid gap-3">
              {BENEFITS.map(item => (
                <div key={item} className="flex items-start gap-3">
                  <Check size={18} className="mt-0.5 text-accent" strokeWidth={2.5} />
                  <span className="font-body text-base font-semibold text-text">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-border pt-8">
              <span className="brand-poster text-5xl">R$ 29,90</span>
              <span className="ml-3 font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted">/mes</span>
              <span className="ml-4 font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-accent">7 dias gratis</span>
            </div>
          </div>

          <div className="rounded-xl bg-text p-8 text-bg shadow-md md:p-10">
            <div className="mb-8 flex items-center gap-2">
              <Sparkles size={14} className="text-accent" strokeWidth={2} />
              <span className="font-body text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">
                Comece hoje
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="email" className="mb-2 block font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#B8B3A0]">
                  Seu email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="w-full rounded-md border border-[#46424F] bg-[#1A1820] px-4 py-3 font-display text-lg italic text-bg outline-none placeholder:text-[#6D6A60] focus:border-accent"
                />
              </div>
              {error && <p className="font-body text-sm font-bold text-red-300">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary disabled:bg-[#46424F] disabled:text-[#6D6A60]">
                {loading ? 'Redirecionando...' : 'Criar conta e assinar'}
              </button>
              <p className="text-center font-body text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#6D6A60]">
                Cancele quando quiser - sem fidelidade
              </p>
            </form>

            <div className="mt-8 border-t border-[#46424F] pt-6">
              <p className="text-[#B8B3A0]">
                Ja tem uma conta?{' '}
                <Link href="/login" className="font-bold text-bg hover:text-accent">
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
