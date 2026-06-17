import fs from 'fs'
import path from 'path'

export type ArticleSummaryEntry = {
  slug: string
  title: string
  tags: string[]
  image?: string
  tldr: string
  key_facts: string[]
  why_it_matters: string
  watch_next: string[]
  editorial_angle: string
  generatedAt: string
}

export type DailySummary = {
  date: string
  updatedAt: string
  articles: ArticleSummaryEntry[]
}

const SUMMARIES_DIR = path.join(process.cwd(), 'data', 'daily-summaries')

function todayBRT(): string {
  return new Date().toLocaleDateString('fr-CA', { timeZone: 'America/Sao_Paulo' })
}

function filePath(date: string): string {
  return path.join(SUMMARIES_DIR, `${date}.json`)
}

export function getTodayDailySummary(): DailySummary | null {
  const today = todayBRT()
  const fp = filePath(today)
  if (!fs.existsSync(fp)) return null
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf-8'))
  } catch {
    return null
  }
}

export function getDailySummaryByDate(date: string): DailySummary | null {
  const fp = filePath(date)
  if (!fs.existsSync(fp)) return null
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf-8'))
  } catch {
    return null
  }
}

export function appendArticleToDailySummary(entry: ArticleSummaryEntry): void {
  if (!fs.existsSync(SUMMARIES_DIR)) {
    fs.mkdirSync(SUMMARIES_DIR, { recursive: true })
  }

  const today = todayBRT()
  const fp = filePath(today)

  let summary: DailySummary = fs.existsSync(fp)
    ? JSON.parse(fs.readFileSync(fp, 'utf-8'))
    : { date: today, updatedAt: new Date().toISOString(), articles: [] }

  // Evita duplicata pelo slug
  const alreadyExists = summary.articles.some(a => a.slug === entry.slug)
  if (!alreadyExists) {
    summary.articles.push(entry)
  }

  summary.updatedAt = new Date().toISOString()
  fs.writeFileSync(fp, JSON.stringify(summary, null, 2), 'utf-8')
}

export function listAvailableDates(): string[] {
  if (!fs.existsSync(SUMMARIES_DIR)) return []
  return fs.readdirSync(SUMMARIES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .sort((a, b) => b.localeCompare(a))
}
