import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import { ScanReportSchema } from '@/lib/schemas'
import type { ScanReport } from '@/lib/schemas'

export const listReports = cache(async (): Promise<Pick<ScanReport, 'id' | 'scan_date' | 'summary' | 'summary_en'>[]> => {
  const { data, error } = await supabase
    .from('scan_results')
    .select('id, scan_date, summary, summary_en')
    .order('scan_date', { ascending: false })

  if (error) return []

  return (data ?? []).map((row) =>
    ScanReportSchema.pick({ id: true, scan_date: true, summary: true, summary_en: true }).parse(row)
  )
})

export const getReport = cache(async (date: string): Promise<ScanReport | null> => {
  const { data, error } = await supabase
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
