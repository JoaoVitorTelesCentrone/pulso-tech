import Footer from '@/components/Footer'

export const metadata = {
  title: 'Termos | Pulso Tech',
  description: 'Termos de uso da Pulso Tech',
}

const sections = [
  ['1. Aceitacao dos termos', 'Ao acessar e utilizar a Pulso Tech, voce concorda com estes termos. Caso nao concorde, nao utilize o servico.'],
  ['2. Conteudo com IA', 'O conteudo editorial pode ser gerado, revisado ou traduzido com auxilio de sistemas de inteligencia artificial. Fazemos esforcos de revisao, mas erros podem ocorrer.'],
  ['3. Propriedade intelectual', 'A estrutura, identidade visual, codigo e curadoria pertencem a Pulso Tech. Citacoes sao permitidas com credito e link para a publicacao original.'],
  ['4. Mudancas no servico', 'Podemos modificar ou descontinuar partes do servico com ou sem aviso previo, incluindo fluxos automatizados de publicacao.'],
  ['5. Limitacao de responsabilidade', 'Os artigos tem finalidade informativa e jornalistica. Nao constituem aconselhamento profissional, financeiro ou tecnico.'],
]

export default function TermsPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-editorial px-5 py-12 md:px-grid-margin md:py-16">
        <article className="mx-auto max-w-4xl">
          <header className="dieline mb-12 rounded-2xl bg-surface px-7 py-10 shadow-sm md:px-12 md:py-14">
            <p className="brand-kicker mb-5">legal</p>
            <h1 className="brand-poster text-5xl md:text-7xl">Termos de uso.</h1>
            <p className="mt-6 max-w-2xl font-display text-2xl italic leading-snug text-muted">
              Condicoes gerais para uso do conteudo automatizado e da curadoria editorial.
            </p>
          </header>

          <div className="space-y-5">
            {sections.map(([title, body]) => (
              <section key={title} className="brand-card p-6">
                <h2 className="font-display text-2xl italic text-text">{title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{body}</p>
              </section>
            ))}
          </div>

          <p className="brand-meta mt-10 border-t border-border pt-6">
            Ultima atualizacao: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
