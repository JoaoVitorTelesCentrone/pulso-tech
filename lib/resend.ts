import { Resend } from 'resend'

export function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM = 'Tech&Future <newsletter@techfuture.com.br>'

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://techfuture.com.br'
}

export async function sendConfirmationEmail(email: string, confirmToken: string) {
  const confirmUrl = `${siteUrl()}/api/confirm?token=${confirmToken}`

  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: 'Confirme sua assinatura — Tech&Future Morning Report',
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EDE8DC;font-family:Georgia,serif">
<div style="max-width:600px;margin:0 auto;padding:40px 20px">

  <div style="background:#0D0D0B;padding:32px 40px">
    <p style="margin:0 0 4px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#C9FF47">Morning Report</p>
    <p style="margin:0;font-size:22px;font-weight:800;color:#F4F0E8;letter-spacing:-0.04em">Tech<span style="color:#C9FF47;font-style:italic">&</span>Future</p>
  </div>

  <div style="background:#F4F0E8;padding:40px;border-left:1px solid #C8C3B8;border-right:1px solid #C8C3B8">
    <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#7A7670">Falta um passo</p>
    <h1 style="margin:0 0 20px;font-size:26px;font-weight:800;color:#0D0D0B;letter-spacing:-0.03em;line-height:1.1">Confirme seu email</h1>
    <p style="margin:0 0 28px;font-size:15px;color:#7A7670;line-height:1.6">Clique no botão abaixo para ativar sua assinatura e começar a receber o digest diário de tecnologia e IA às 06h BRT.</p>

    <a href="${confirmUrl}" style="display:inline-block;background:#0D0D0B;color:#F4F0E8;padding:16px 32px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none">
      Confirmar Assinatura →
    </a>

    <p style="margin:32px 0 0;font-size:12px;color:#7A7670;line-height:1.5">Se você não solicitou esta inscrição, ignore este email. O link expira em 24 horas.</p>
  </div>

  <div style="background:#0D0D0B;padding:20px 40px">
    <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#7A7670">Tech&Future · JV Centrone · ${new Date().getFullYear()}</p>
  </div>

</div>
</body></html>`,
  })
}

export type DigestArticle = {
  title: string
  slug: string
  excerpt: string
  date: string
  tags?: string[]
}

export async function sendDigestEmail(
  email: string,
  subscriberId: string,
  articles: DigestArticle[]
) {
  const unsubscribeUrl = `${siteUrl()}/api/unsubscribe?id=${subscriberId}`
  const dateStr = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo',
  })

  const articlesHtml = articles.map(a => {
    const url = `${siteUrl()}/post/${a.slug}`
    const tagsHtml = (a.tags || []).slice(0, 3).map(t =>
      `<span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;padding:2px 8px;border:1px solid #C8C3B8;color:#7A7670;margin-right:4px">${t}</span>`
    ).join('')

    return `
    <div style="padding:28px 0;border-bottom:1px solid #C8C3B8">
      ${tagsHtml ? `<p style="margin:0 0 10px">${tagsHtml}</p>` : ''}
      <h2 style="margin:0 0 10px;font-size:21px;font-weight:800;color:#0D0D0B;letter-spacing:-0.03em;line-height:1.1">${a.title}</h2>
      <p style="margin:0 0 16px;font-size:14px;color:#7A7670;line-height:1.6;font-style:italic">${a.excerpt}</p>
      <a href="${url}" style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#0D0D0B;text-decoration:none;border-bottom:1px solid #0D0D0B;padding-bottom:1px">
        Ler artigo completo →
      </a>
    </div>`
  }).join('')

  const subject = articles.length === 1
    ? articles[0].title
    : `${articles.length} artigos de hoje — Tech&Future`

  return getResend().emails.send({
    from: FROM,
    to: email,
    subject,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EDE8DC;font-family:Georgia,serif">
<div style="max-width:600px;margin:0 auto;padding:40px 20px">

  <div style="background:#0D0D0B;padding:32px 40px">
    <p style="margin:0 0 4px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#C9FF47">${dateStr}</p>
    <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#F4F0E8;letter-spacing:-0.04em">Tech<span style="color:#C9FF47;font-style:italic">&</span>Future</p>
    <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:#7A7670;letter-spacing:0.08em">Morning Report</p>
  </div>

  <div style="background:#F4F0E8;padding:32px 40px;border-left:1px solid #C8C3B8;border-right:1px solid #C8C3B8">
    ${articlesHtml}
  </div>

  <div style="background:#0D0D0B;padding:20px 40px;display:flex;justify-content:space-between;align-items:center">
    <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#7A7670">Tech&Future · Morning Report</p>
    <a href="${unsubscribeUrl}" style="font-family:'Courier New',monospace;font-size:10px;color:#7A7670;text-decoration:none;letter-spacing:0.08em">Cancelar</a>
  </div>

</div>
</body></html>`,
  })
}
