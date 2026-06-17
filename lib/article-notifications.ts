import { getSupabase } from './supabase'
import { DigestArticle, sendDigestEmail } from './resend'
import { ArticleSummaryEntry } from './daily-summary'

export type ArticleNotificationResult = {
  subscribers: number
  sent: number
  failed: number
}

function summaryToDigestArticle(entry: ArticleSummaryEntry): DigestArticle {
  return {
    title: entry.title,
    slug: entry.slug,
    excerpt: entry.tldr || entry.why_it_matters || '',
    date: entry.generatedAt,
    tags: entry.tags,
  }
}

export async function notifySubscribersAboutNewArticle(
  entry: ArticleSummaryEntry
): Promise<ArticleNotificationResult> {
  if (!process.env.BREVO_API_KEY) {
    console.warn('[EMAIL] BREVO_API_KEY ausente. Pulando envio do novo artigo.')
    return { subscribers: 0, sent: 0, failed: 0 }
  }

  const supabase = getSupabase()
  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('id, email')
    .eq('confirmed', true)
    .is('unsubscribed_at', null)

  if (error) {
    throw new Error(`[EMAIL] Erro ao buscar assinantes: ${error.message}`)
  }

  if (!subscribers || subscribers.length === 0) {
    console.log('[EMAIL] Nenhum assinante ativo para notificar.')
    return { subscribers: 0, sent: 0, failed: 0 }
  }

  const article = summaryToDigestArticle(entry)
  let sent = 0
  let failed = 0

  console.log(`[EMAIL] Enviando novo artigo para ${subscribers.length} assinante(s): ${entry.title}`)

  for (const subscriber of subscribers) {
    try {
      await sendDigestEmail(subscriber.email, subscriber.id, [article])
      sent++
      console.log(`  [EMAIL] OK ${subscriber.email}`)
    } catch (err) {
      failed++
      console.error(`  [EMAIL] Falha ${subscriber.email}:`, err)
    }

    await new Promise(resolve => setTimeout(resolve, 200))
  }

  console.log(`[EMAIL] Novo artigo enviado. ${sent} OK, ${failed} falha(s).`)
  return { subscribers: subscribers.length, sent, failed }
}
