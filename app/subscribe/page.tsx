'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import { PulsoMark } from '@/components/PulsoMark'

type Status = 'idle' | 'loading' | 'success' | 'error'
type CheckoutStatus = 'idle' | 'loading' | 'error'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [lang, setLang] = useState('pt')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [premiumEmail, setPremiumEmail] = useState('')
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>('idle')
  const [checkoutError, setCheckoutError] = useState('')

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setCheckoutStatus('loading')
    setCheckoutError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: premiumEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        setCheckoutError(data.error || 'Erro')
        setCheckoutStatus('error')
        return
      }
      window.location.href = data.url
    } catch {
      setCheckoutError('Falha de conexao.')
      setCheckoutStatus('error')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Erro desconhecido.')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setErrorMsg('Falha de conexao. Tente novamente.')
      setStatus('error')
    }
  }

  return (
    <>
      <main className="mx-auto w-full max-w-editorial px-5 py-12 md:px-grid-margin md:py-16">
        <section className="mb-16 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="brand-kicker mb-5">newsletter / pulso tech</p>
            <h1 className="brand-poster max-w-4xl text-6xl md:text-display-xl">
              Assine o Pulso.
            </h1>
            <p className="mt-6 max-w-xl font-display text-2xl italic leading-snug text-muted">
              O ritmo da tecnologia e IA direto no seu email quando cada nova analise nasce.
            </p>
          </div>
          <div className="dieline rounded-2xl bg-surface p-8 shadow-sm">
            <PulsoMark className="mb-8 h-16" />
            {status === 'success' ? (
              <div>
                <p className="brand-kicker mb-4">quase la</p>
                <h2 className="font-display text-3xl italic text-text">Verifique seu email.</h2>
                <p className="mt-4 leading-relaxed text-muted">
                  Enviamos um link de confirmacao para <strong className="text-text">{email}</strong>.
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="meta-label mb-2 block">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-md border border-border bg-bg px-4 py-3 font-display text-lg italic text-text outline-none transition-colors placeholder:text-faint focus:border-accent"
                    placeholder="email@dominio.com"
                  />
                </div>

                <div>
                  <span className="meta-label mb-3 block">Idioma</span>
                  <div className="grid gap-2">
                    {[
                      { value: 'pt', label: 'Portugues' },
                      { value: 'en', label: 'English' },
                      { value: 'bilingual', label: 'Bilingue' },
                    ].map(({ value, label }) => (
                      <label key={value} className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-bg px-4 py-3 transition-colors hover:border-border-strong">
                        <input
                          type="radio"
                          name="lang"
                          value={value}
                          checked={lang === value}
                          onChange={() => setLang(value)}
                          className="accent-accent"
                        />
                        <span className="font-body text-sm font-semibold text-text">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {status === 'error' && (
                  <p className="font-body text-sm font-bold text-red-700">{errorMsg}</p>
                )}

                <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:bg-border disabled:text-faint">
                  {status === 'loading' ? 'Enviando...' : 'Assinar gratis'}
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="brand-card p-8">
            <p className="brand-meta mb-3 text-text">gratuito</p>
            <p className="brand-poster text-5xl">R$ 0</p>
            <p className="mt-2 font-display italic text-muted">para sempre</p>
            <ul className="mt-8 space-y-3 text-muted">
              {['Leitura ilimitada no blog', 'Briefing editorial de cada artigo', 'Emails quando novos posts sao gerados'].map(item => (
                <li key={item} className="flex gap-3"><span className="text-accent">-</span>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-text p-8 text-bg shadow-md">
            <p className="mb-3 font-body text-[0.68rem] font-bold uppercase tracking-[0.18em] text-accent">premium</p>
            <p className="brand-poster text-5xl text-bg">R$ 29,90</p>
            <p className="mt-2 font-display italic text-[#B8B3A0]">por mes - 7 dias gratis</p>
            <ul className="mt-8 space-y-3 text-[#B8B3A0]">
              {['Tudo do plano gratuito', 'Slides prontos de cada edicao', 'Carrosseis para LinkedIn', 'Acesso ao conteudo visual'].map(item => (
                <li key={item} className="flex gap-3"><span className="text-accent">-</span>{item}</li>
              ))}
            </ul>
            <form onSubmit={handleCheckout} className="mt-8 flex flex-col gap-3 border-t border-[#46424F] pt-6">
              <input
                type="email"
                required
                value={premiumEmail}
                onChange={e => setPremiumEmail(e.target.value)}
                placeholder="seu@email.com"
                className="rounded-md border border-[#46424F] bg-[#1A1820] px-4 py-3 font-display text-lg italic text-bg outline-none placeholder:text-[#6D6A60] focus:border-accent"
              />
              {checkoutError && (
                <p className="font-body text-sm font-bold text-red-300">{checkoutError}</p>
              )}
              <button type="submit" disabled={checkoutStatus === 'loading'} className="btn-primary disabled:bg-[#46424F] disabled:text-[#6D6A60]">
                {checkoutStatus === 'loading' ? 'Aguarde...' : 'Comecar premium'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
