import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { getDailySummaryByDate, ArticleSummaryEntry } from '../lib/daily-summary'
import { sendDigestEmail, DigestArticle } from '../lib/resend'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const SENT_LOG_PATH = path.join(process.cwd(), 'data', 'daily-digest-sent.json')

function yesterdayBRT(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('fr-CA', { timeZone: 'America/Sao_Paulo' })
}

function alreadySent(date: string): boolean {
  if (!fs.existsSync(SENT_LOG_PATH)) return false
  try {
    const data = JSON.parse(fs.readFileSync(SENT_LOG_PATH, 'utf-8'))
    return (data.sent_dates as string[] || []).includes(date)
  } catch {
    return false
  }
}

function markSent(date: string) {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  let data: { sent_dates: string[] } = { sent_dates: [] }
  if (fs.existsSync(SENT_LOG_PATH)) {
    try { data = JSON.parse(fs.readFileSync(SENT_LOG_PATH, 'utf-8')) } catch {}
  }
  if (!data.sent_dates.includes(date)) data.sent_dates.push(date)
  fs.writeFileSync(SENT_LOG_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

function toDigestArticle(entry: ArticleSummaryEntry): DigestArticle {
  return {
    title: entry.title,
    slug: entry.slug,
    excerpt: entry.tldr || entry.why_it_matters || '',
    date: entry.generatedAt,
    tags: entry.tags,
  }
}

async function main() {
  const yesterday = yesterdayBRT()
  console.log(`[DIGEST] Processando resumo do dia: ${yesterday}`)

  if (alreadySent(yesterday)) {
    console.log(`[DIGEST] Resumo de ${yesterday} ja enviado. Pulando.`)
    return
  }

  const summary = getDailySummaryByDate(yesterday)
  if (!summary || summary.articles.length === 0) {
    console.log(`[DIGEST] Nenhum artigo encontrado para ${yesterday}. Pulando.`)
    return
  }

  console.log(`[DIGEST] ${summary.articles.length} artigo(s) encontrado(s).`)

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('id, email')
    .eq('confirmed', true)
    .is('unsubscribed_at', null)

  if (error) {
    console.error('[DIGEST] Erro ao buscar assinantes:', error)
    process.exit(1)
  }

  const activeSubscribers = subscribers ?? []
  if (activeSubscribers.length === 0) {
    console.log('[DIGEST] Nenhum assinante ativo. Marcando como enviado.')
    markSent(yesterday)
    return
  }

  console.log(`[DIGEST] Enviando para ${activeSubscribers.length} assinante(s)...`)
  const articles = summary.articles.map(toDigestArticle)
  let sent = 0
  let failed = 0

  for (const sub of activeSubscribers) {
    try {
      await sendDigestEmail(sub.email, sub.id, articles)
      sent++
      console.log(`  [DIGEST] OK ${sub.email}`)
    } catch (err) {
      failed++
      console.error(`  [DIGEST] Falha ${sub.email}:`, err)
    }
    await new Promise(r => setTimeout(r, 200))
  }

  markSent(yesterday)
  console.log(`[DIGEST] Concluido. Enviados: ${sent}, Falhas: ${failed}`)
  if (failed > 0) process.exit(1)
}

main().catch(err => {
  console.error('[DIGEST] Erro fatal:', err)
  process.exit(1)
})
