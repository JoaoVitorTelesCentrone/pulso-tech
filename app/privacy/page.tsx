import Footer from '@/components/Footer'

export const metadata = {
  title: 'Privacidade | Pulso Tech',
  description: 'Politica de privacidade e protecao de dados da Pulso Tech',
}

const sections = [
  ['1. Coleta de dados', 'Coletamos apenas as informacoes necessarias para operar o servico, como o email informado na assinatura e dados essenciais de navegacao.'],
  ['2. Uso das informacoes', 'Usamos seu email para enviar confirmacoes, links de acesso, comunicacoes da conta e os emails editoriais da Pulso Tech.'],
  ['3. Cookies', 'Podemos usar cookies essenciais e metricas agregadas para entender funcionamento do site. Voce pode controlar cookies pelo navegador.'],
  ['4. Seguranca', 'Adotamos medidas tecnicas e organizacionais para proteger os dados, embora nenhum metodo de transmissao na internet seja absoluto.'],
  ['5. Direitos do usuario', 'Voce pode solicitar acesso, correcao ou exclusao dos seus dados e cancelar a assinatura pelos links enviados nos emails.'],
]

export default function PrivacyPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-editorial px-5 py-12 md:px-grid-margin md:py-16">
        <article className="mx-auto max-w-4xl">
          <header className="dieline mb-12 rounded-2xl bg-surface px-7 py-10 shadow-sm md:px-12 md:py-14">
            <p className="brand-kicker mb-5">privacidade</p>
            <h1 className="brand-poster text-5xl md:text-7xl">Politica de privacidade.</h1>
            <p className="mt-6 max-w-2xl font-display text-2xl italic leading-snug text-muted">
              Transparencia e protecao dos seus dados pessoais.
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
