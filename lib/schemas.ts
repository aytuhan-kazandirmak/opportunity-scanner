import { z } from 'zod'

export const CompetitorSchema = z.object({
  name: z.string(),
  type: z.enum(['big-tech', 'startup', 'solo-dev', 'open-source', 'other']),
  url: z.string().url().optional(),
})

export const OpportunitySchema = z.object({
  title: z.string(),
  what: z.string(),
  what_en: z.string().optional(),
  why_it_matters: z.string(),
  why_it_matters_en: z.string().optional(),
  missing_piece: z.string(),
  missing_piece_en: z.string().optional(),
  build_time: z.string(),
  competition: z.enum(['none', 'low', 'medium', 'high']),
  competitors: z.array(CompetitorSchema).optional(),
  domain_idea: z.string().optional(),
  verification: z.enum(['verified', 'unverified', 'removed']),
  source_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  opportunity_score: z.number().min(0).max(100).optional(),
})

// Strict schema for writing: enforces minimum lengths for content fields
export const OpportunityInputSchema = OpportunitySchema.extend({
  what: z.string().min(80),
  what_en: z.string().min(80).optional(),
  why_it_matters: z.string().min(80),
  why_it_matters_en: z.string().min(80).optional(),
  missing_piece: z.string().min(80),
  missing_piece_en: z.string().min(80).optional(),
})

export const ScanReportSchema = z.object({
  id: z.string().uuid(),
  scan_date: z.string(),
  opportunities: z.array(OpportunitySchema),
  summary: z.string().nullable(),
  summary_en: z.string().nullable().optional(),
  created_at: z.string(),
})

export type Competitor = z.infer<typeof CompetitorSchema>
export type Opportunity = z.infer<typeof OpportunitySchema>
export type ScanReport = z.infer<typeof ScanReportSchema>
