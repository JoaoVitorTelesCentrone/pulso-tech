import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// ── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BREVO_API_KEY = process.env.BREVO_API_KEY!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulso.news'
const FROM_NAME = 'Pulso'
const FROM_EMAIL = 'pulsotech@proton.me'

const DIGEST_HISTORY_PATH = path.join(process.cwd(), 'data', 'digest-sent.json')

// ── Helpers ──────────────────────────────────────────────────────────────────

function todayBRT(): string {
  return new Date().toLocaleDateString('fr-CA', { timeZone: 'America/Sao_Paulo' }) // YYYY-MM-DD
}

function getLastSentDate(): string | null {
  if (!fs.existsSync(DIGEST_HISTORY_PATH)) return null
  try {
    const data = JSON.parse(fs.readFileSync(DIGEST_HISTORY_PATH, 'utf-8'))
    return data.last_sent || null
  } catch {
    return null
  }
}

function markDigestSent(date: string) {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(DIGEST_HISTORY_PATH, JSON.stringify({ last_sent: date }, null, 2), 'utf-8')
}

type ArticleMeta = {
  title: string
  slug: string
  excerpt: string
  date: string
  tags: string[]
}

function getTodayArticles(): ArticleMeta[] {
  const articlesDir = path.join(process.cwd(), 'content', 'articles')
  if (!fs.existsSync(articlesDir)) return []

  const today = todayBRT()

  return fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const slug = f.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(articlesDir, f), 'utf-8')
      const { data, content } = matter(raw)
      const articleDate = (data.date as string || '').substring(0, 10)
      return {
        slug,
        title: data.title || slug,
        date: articleDate,
        tags: data.tags || [],
        excerpt: content.replace(/#+\s[^\n]*/g, '').replace(/\*\*/g, '').trim().substring(0, 280) + '…',
      }
    })
    .filter(a => a.date === today)
    .sort((a, b) => b.slug.localeCompare(a.slug))
}

function buildDigestHtml(articles: ArticleMeta[], unsubscribeUrl: string): string {
  const dateStr = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo',
  })

  const articlesHtml = articles.map(a => {
    const url = `${SITE_URL}/post/${a.slug}`
    const tagsHtml = a.tags.slice(0, 3).map(t =>
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

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EDE8DC;font-family:Georgia,serif">
<div style="max-width:600px;margin:0 auto;padding:40px 20px">

  <div style="background:#0D0D0B;padding:32px 40px">
    <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#7A7670">${dateStr}</p>
    <div style="display:flex;align-items:center;gap:10px">
      <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#FF3D00;flex-shrink:0"></span>
      <p style="margin:0;font-size:22px;font-weight:800;color:#F4F0E8;letter-spacing:-0.04em">Pulso</p>
    </div>
  </div>

  <div style="background:#F4F0E8;padding:32px 40px;border-left:1px solid #C8C3B8;border-right:1px solid #C8C3B8">
    ${articlesHtml}
  </div>

  <div style="background:#0D0D0B;padding:20px 40px">
    <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#7A7670">Pulso · O ritmo da tecnologia</p>
    <a href="${unsubscribeUrl}" style="font-family:'Courier New',monospace;font-size:10px;color:#7A7670;text-decoration:none;letter-spacing:0.08em">Cancelar assinatura</a>
  </div>

</div>
</body></html>`
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('[DIGEST] Fluxo legado desativado. Os emails Brevo agora saem quando cada artigo e resumo sao gerados.')
  return

  const today = todayBRT()

  // Only send once per day
  const lastSent = getLastSentDate()
  if (lastSent === today) {
    console.log(`[DIGEST] Digest já enviado hoje (${today}). Pulando.`)
    return
  }

  const articles = getTodayArticles()
  if (articles.length === 0) {
    console.log('[DIGEST] Nenhum artigo de hoje encontrado. Pulando.')
    return
  }

  console.log(`[DIGEST] ${articles.length} artigo(s) encontrado(s) para hoje.`)

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('id, email, lang')
    .eq('confirmed', true)
    .is('unsubscribed_at', null)

  if (error) {
    console.error('[DIGEST] Erro ao buscar subscribers:', error)
    process.exit(1)
  }

  const activeSubscribers = subscribers ?? []

  if (activeSubscribers.length === 0) {
    console.log('[DIGEST] Nenhum subscriber ativo. Marcando como enviado mesmo assim.')
    markDigestSent(today)
    return
  }

  console.log(`[DIGEST] Enviando para ${activeSubscribers.length} subscriber(s)...`)

  const subject = articles.length === 1
    ? articles[0].title
    : `Pulso de hoje — ${articles.length} análises de tecnologia e IA`

  let sent = 0
  let failed = 0

  for (const sub of activeSubscribers) {
    const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?id=${sub.id}`
    const html = buildDigestHtml(articles, unsubscribeUrl)

    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: FROM_NAME, email: FROM_EMAIL },
          to: [{ email: sub.email }],
          subject,
          htmlContent: html,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      sent++
      console.log(`  ✓ ${sub.email}`)
    } catch (err) {
      failed++
      console.error(`  ✗ ${sub.email}:`, err)
    }

    // Brevo free tier: ~10 emails/sec — pequeno delay para segurança
    await new Promise(r => setTimeout(r, 200))
  }

  markDigestSent(today)
  console.log(`[DIGEST] Concluído. ✓ ${sent} enviados, ✗ ${failed} falhas.`)
}

main().catch(err => {
  console.error('[DIGEST] Erro fatal:', err)
  process.exit(1)
})
