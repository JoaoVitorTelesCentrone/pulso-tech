'use client'

import { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [lang, setLang] = useState('pt')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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
      setErrorMsg('Falha de conexão. Tente novamente.')
      setStatus('error')
    }
  }

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col">
        <section className="grid grid-cols-12 gap-grid-gutter px-6 md:px-grid-margin py-section-gap max-w-editorial mx-auto w-full">
          {/* Left metadata */}
          <div className="col-span-12 md:col-span-2 flex flex-col gap-4 border-l border-primary pt-2 pl-4 mb-8 md:mb-0">
            <span className="font-label-caps text-label-caps uppercase text-primary">Nº 047</span>
            <span className="font-label-caps text-label-caps uppercase text-secondary">EDITION 2026</span>
          </div>

          {/* Content column */}
          <div className="col-span-12 md:col-span-7 flex flex-col gap-stack-md">
            <h1 className="font-newsreader font-semibold text-primary text-3xl sm:text-5xl md:text-display-xl max-w-2xl">
              Assine o Morning Report
            </h1>
            <p className="font-work-sans text-body-lg text-on-surface-variant max-w-xl">
              Um digest diário com o que realmente importa em tecnologia e inteligência artificial,
              entregue às 06h BRT.
            </p>

            {status === 'success' ? (
              <div className="mt-stack-md p-8 border border-primary bg-surface-bright max-w-lg">
                <p className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-muted mb-3">
                  Quase lá
                </p>
                <h2 className="font-syne font-extrabold text-ink text-2xl mb-4 leading-tight">
                  Verifique seu email
                </h2>
                <div className="w-8 h-px bg-electric mb-4" />
                <p className="font-cormorant font-light text-muted text-lg leading-relaxed">
                  Enviamos um link de confirmação para <strong className="text-ink">{email}</strong>.
                  Clique nele para ativar sua assinatura.
                </p>
              </div>
            ) : (
              <div className="mt-stack-md p-8 border border-primary bg-surface-bright max-w-lg">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-label-caps text-label-caps uppercase text-primary">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="bg-transparent border-t-0 border-l-0 border-r-0 border-b border-primary px-0 py-2 focus:ring-0 focus:border-on-tertiary-container font-work-sans text-body-md text-primary placeholder-outline-variant"
                      placeholder="email@dominio.com"
                    />
                  </div>

                  {/* Language */}
                  <div className="flex flex-col gap-4">
                    <span className="font-label-caps text-label-caps uppercase text-primary">Idioma Preferido</span>
                    <div className="flex flex-col gap-3">
                      {[
                        { id: 'lang-pt', value: 'pt', label: 'Português' },
                        { id: 'lang-en', value: 'en', label: 'English' },
                        { id: 'lang-bi', value: 'bilingual', label: 'Bilíngue (ambos)' },
                      ].map(({ id, value, label }) => (
                        <label key={id} htmlFor={id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            id={id}
                            type="radio"
                            name="lang"
                            value={value}
                            checked={lang === value}
                            onChange={() => setLang(value)}
                            className="w-4 h-4 text-primary border-primary focus:ring-offset-0 focus:ring-0 accent-primary"
                          />
                          <span className="font-work-sans text-body-md text-on-surface group-hover:text-on-tertiary-container transition-colors">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Error */}
                  {status === 'error' && (
                    <p className="font-dm-mono text-[0.65rem] tracking-[0.1em] text-red-600">{errorMsg}</p>
                  )}

                  {/* Submit */}
                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="bg-primary text-on-primary py-4 px-8 font-label-caps text-label-caps uppercase tracking-widest hover:bg-on-tertiary-container transition-colors duration-300 disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Enviando...' : 'Assinar →'}
                    </button>
                    <p className="font-work-sans text-sm italic text-secondary text-center">
                      Enviaremos um email de confirmação.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right image column */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-8">
            <div className="aspect-[3/4] border border-primary relative overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzYSHuxlVq6hRgiGV-AzRaVNoOlRuC-Hi6npSlic4Pkhs85tC9VKlKoaDjXcRZluxaVdT3s2COEjceCQbFz5LxMQUIVpb5d-eDg_ibLReWRQhb1N6yUEUkEfYnO8h-XA3zwPFpxocn-Qb3gMo6DSfEOem2n8uOhgIs3sc7ql4kqYJLewRhAIgjwAh0sJ_XiYIxw-jzvS3SXbfdkusUkGoWsbZ022dFhpfBEDh9Y3o9t0YRZLRJ1oDB4Ayk92K-h-ivhRujkSkE3WE"
                alt="Minimalismo tecnológico"
                fill
                className="object-cover grayscale brightness-90"
              />
              <div className="absolute inset-0 border border-white/20 pointer-events-none" />
            </div>
            <div className="border-t border-primary pt-4">
              <p className="font-work-sans text-sm text-secondary uppercase tracking-tighter italic">
                &ldquo;Precision is the hallmark of the digital era.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-6 md:px-grid-margin pb-section-gap max-w-editorial mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-primary">
            {[
              {
                icon: 'auto_awesome',
                title: 'Inteligência Diária',
                body: 'Análise sintetizada dos principais movimentos em tecnologia, entregue às 06h BRT.',
              },
              {
                icon: 'history_edu',
                title: 'Rigor Editorial',
                body: 'Sem clickbait. Jornalismo de profundidade que respeita seu tempo e inteligência.',
              },
              {
                icon: 'lock',
                title: 'Privacidade Primeiro',
                body: 'Seus dados são seus. Não rastreamos, vendemos ou compartilhamos informações de assinantes.',
              },
            ].map(({ icon, title, body }, i) => (
              <div
                key={title}
                className={`p-8 flex flex-col gap-4 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-primary' : ''}`}
              >
                <span className="material-symbols-outlined text-on-tertiary-container">{icon}</span>
                <h3 className="font-newsreader font-medium text-headline-md">{title}</h3>
                <p className="font-work-sans text-body-md text-on-surface-variant">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
