import fs from 'fs'
import path from 'path'

const GENERATED_RUN_PATH = path.join(process.cwd(), 'data', 'generated-run.json')
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-blog-joaovitortelescentrone-centrones-projects.vercel.app').replace(/\/$/, '')
const TIMEOUT_MS = Number(process.env.PUBLICATION_TIMEOUT_MS || 10 * 60 * 1000)
const INTERVAL_MS = Number(process.env.PUBLICATION_POLL_INTERVAL_MS || 15 * 1000)

type GeneratedRun = {
  articles?: { slug: string }[]
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function readGeneratedRun(): GeneratedRun {
  if (!fs.existsSync(GENERATED_RUN_PATH)) return { articles: [] }
  return JSON.parse(fs.readFileSync(GENERATED_RUN_PATH, 'utf-8'))
}

async function isPublished(slug: string): Promise<boolean> {
  const url = `${SITE_URL}/post/${slug}`
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow' })
    console.log(`[PUBLISH] ${url} -> ${res.status}`)
    return res.ok
  } catch (error) {
    const cause = (error as Error & { cause?: { message?: string; code?: string } }).cause
    const detail = cause?.code || cause?.message || (error as Error).message
    console.log(`[PUBLISH] ${url} -> fetch failed (${detail})`)
    return false
  }
}

async function main() {
  const run = readGeneratedRun()
  const slugs = (run.articles || []).map(article => article.slug)

  if (slugs.length === 0) {
    console.log('[PUBLISH] Nenhum artigo gerado nesta execucao.')
    return
  }

  const deadline = Date.now() + TIMEOUT_MS
  const pending = new Set(slugs)

  while (pending.size > 0 && Date.now() < deadline) {
    for (const slug of [...pending]) {
      if (await isPublished(slug)) {
        pending.delete(slug)
      }
    }

    if (pending.size > 0) {
      console.log(`[PUBLISH] Aguardando deploy: ${[...pending].join(', ')}`)
      await sleep(INTERVAL_MS)
    }
  }

  if (pending.size > 0) {
    throw new Error(`[PUBLISH] Timeout aguardando publicacao: ${[...pending].join(', ')}`)
  }

  console.log('[PUBLISH] Todos os artigos gerados estao publicos.')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
