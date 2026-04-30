import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { OpportunityInputSchema } from '@/lib/schemas'

const BodySchema = z.object({
  scan_date: z.string(),
  opportunities: z.array(OpportunityInputSchema),
  summary: z.string().nullable().optional(),
  summary_en: z.string().nullable().optional(),
})

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.REPORT_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('scan_results')
    .upsert(parsed.data, { onConflict: 'scan_date' })
    .select('id, scan_date')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
}
