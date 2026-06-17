import fs from 'fs'
import path from 'path'
import { ArticleSummaryEntry } from '../lib/daily-summary'
import { notifySubscribersAboutNewArticle } from '../lib/article-notifications'

const GENERATED_RUN_PATH = path.join(process.cwd(), 'data', 'generated-run.json')

type GeneratedRun = {
  articles?: ArticleSummaryEntry[]
}

function readGeneratedRun(): GeneratedRun {
  if (!fs.existsSync(GENERATED_RUN_PATH)) return { articles: [] }
  return JSON.parse(fs.readFileSync(GENERATED_RUN_PATH, 'utf-8'))
}

async function main() {
  const run = readGeneratedRun()
  const articles = run.articles || []

  if (articles.length === 0) {
    console.log('[EMAIL] Nenhum artigo gerado nesta execucao.')
    return
  }

  let sent = 0
  let failed = 0

  for (const article of articles) {
    try {
      const result = await notifySubscribersAboutNewArticle(article)
      sent += result.sent
      failed += result.failed
    } catch (error) {
      failed++
      console.error(`[EMAIL] Erro ao notificar artigo ${article.slug}:`, error)
    }
  }

  if (failed > 0) {
    throw new Error(`[EMAIL] Envio concluido com falhas. OK=${sent}, falhas=${failed}`)
  }

  console.log(`[EMAIL] Envio concluido. OK=${sent}, falhas=${failed}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
