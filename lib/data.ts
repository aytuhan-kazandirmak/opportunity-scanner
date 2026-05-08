import { cache } from 'react'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { ScanReportSchema } from '@/lib/schemas'
import type { ScanReport } from '@/lib/schemas'

export type ListReport = {
  id: string
  scan_date: string
  summary: string | null
  summary_en: string | null
  opp_count: number
  low_comp_count: number
  tool_tags: string[]
  has_hot: boolean
}

const REPORT_TOOL_TAGS = [
  'Claude Code',
  'Cursor',
  'Codex',
  'Windsurf',
  'v0',
  'Replit Agent',
] as const

const oppCompSchema = z.array(
  z.object({
    competition: z.string().optional(),
    title: z.string().optional(),
    what: z.string().optional(),
  }),
)

export const listReports = cache(async (): Promise<ListReport[]> => {
  const { data, error } = await supabaseAdmin
    .from('scan_results')
    .select('id, scan_date, summary, summary_en, opportunities')
    .order('scan_date', { ascending: false })

  if (error) {
    console.error('[listReports] Supabase error:', { message: error.message, code: error.code, details: error.details, hint: error.hint })
    return []
  }

  return (data ?? []).map((row) => {
    const parsed = oppCompSchema.safeParse(row.opportunities)
    const opps = parsed.success ? parsed.data : []
    const toolTags = [
      ...new Set(
        opps.flatMap((o) => {
          const text = `${o.title ?? ''} ${o.what ?? ''}`.toLowerCase()
          return REPORT_TOOL_TAGS.filter((t) => text.includes(t.toLowerCase()))
        }),
      ),
    ]
    const hasHot = opps.some(
      (o) => o.competition === 'none' || o.competition === 'low',
    )
    return {
      id: row.id,
      scan_date: row.scan_date,
      summary: row.summary,
      summary_en: row.summary_en ?? null,
      opp_count: opps.length,
      low_comp_count: opps.filter(
        (o) => o.competition === 'none' || o.competition === 'low',
      ).length,
      tool_tags: toolTags,
      has_hot: hasHot,
    }
  })
})

export const getReport = cache(async (date: string): Promise<ScanReport | null> => {
  const { data, error } = await supabaseAdmin
    .from('scan_results')
    .select('*')
    .eq('scan_date', date)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return ScanReportSchema.parse(data)
})
