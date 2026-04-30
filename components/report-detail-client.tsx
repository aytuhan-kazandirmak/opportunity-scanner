'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  ExternalLink,
  Globe,
  Lightbulb,
  Puzzle,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import type { ScanReport, Opportunity, Competitor } from '@/lib/schemas'

const competitionBorder: Record<Opportunity['competition'], string> = {
  none: 'border-l-green-500',
  low: 'border-l-blue-500',
  medium: 'border-l-amber-500',
  high: 'border-l-red-500',
}

const competitionBadge: Record<Opportunity['competition'], string> = {
  none: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const verificationBadge: Record<Opportunity['verification'], string> = {
  verified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  unverified: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  removed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const verificationIcon: Record<Opportunity['verification'], ReactNode> = {
  verified: <CircleCheck className="size-3" />,
  unverified: <CircleAlert className="size-3" />,
  removed: <CircleX className="size-3" />,
}

function Field({ icon, label, children }: { icon: ReactNode; label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="text-sm leading-relaxed">{children}</span>
      </div>
    </div>
  )
}

function CompetitorBadge({ competitor }: { competitor: Competitor }) {
  const typeKey = `report.competitor.type.${competitor.type}` as const

  const badge = (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
      <FormattedMessage id={typeKey} />
      {' · '}
      {competitor.name}
      {competitor.url && <ExternalLink className="size-2.5 opacity-60" />}
    </span>
  )

  if (competitor.url) {
    return (
      <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="inline-block transition-opacity hover:opacity-75">
        {badge}
      </a>
    )
  }
  return <>{badge}</>
}

export function ReportDetailClient({ report }: { report: ScanReport }) {
  const { locale } = useIntl()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const totalCount = report.opportunities.length
  const verifiedCount = report.opportunities.filter((o) => o.verification === 'verified').length

  // After mount, show locale-appropriate content; before mount show TR (matches SSR default)
  function localise(tr: string, en: string | undefined) {
    return mounted && locale === 'en' ? (en ?? tr) : tr
  }

  const summary = localise(report.summary ?? '', report.summary_en ?? undefined)

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold tracking-tight">
        <FormattedMessage id="report.title" />
      </h1>

      {summary && (
        <p className="mb-6 text-base leading-relaxed text-muted-foreground">
          {summary}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
          <Zap className="size-3.5 text-muted-foreground" />
          <FormattedMessage id="report.opportunities.count" values={{ count: totalCount }} />
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CircleCheck className="size-3.5" />
          <FormattedMessage id="report.verified.count" values={{ count: verifiedCount }} />
        </div>
      </div>

      {report.opportunities.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          <FormattedMessage id="report.noOpportunities" />
        </p>
      ) : (
        <ul className="mt-10 flex flex-col gap-8">
          {report.opportunities.map((opp, i) => (
            <li key={i}>
              <Card className={`border-l-4 ${competitionBorder[opp.competition]}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <span className="shrink-0 select-none font-mono text-3xl font-bold leading-none text-muted-foreground/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-1 flex-col gap-2">
                      <CardTitle className="text-base font-semibold leading-snug">
                        {opp.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={verificationBadge[opp.verification]}>
                          {verificationIcon[opp.verification]}
                          <FormattedMessage id={`report.badge.${opp.verification}`} />
                        </Badge>
                        <Badge variant="outline" className={competitionBadge[opp.competition]}>
                          <TrendingUp className="size-3" />
                          <FormattedMessage id={`report.competition.${opp.competition}`} />
                        </Badge>
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                          <Clock className="size-3" />
                          {opp.build_time}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  <Field
                    icon={<Lightbulb className="size-4" />}
                    label={<FormattedMessage id="report.field.what" />}
                  >
                    {localise(opp.what, opp.what_en)}
                  </Field>

                  <Field
                    icon={<Sparkles className="size-4" />}
                    label={<FormattedMessage id="report.field.whyItMatters" />}
                  >
                    {localise(opp.why_it_matters, opp.why_it_matters_en)}
                  </Field>

                  <Field
                    icon={<Puzzle className="size-4" />}
                    label={<FormattedMessage id="report.field.missingPiece" />}
                  >
                    {localise(opp.missing_piece, opp.missing_piece_en)}
                  </Field>

                  {opp.competitors && opp.competitors.length > 0 && (
                    <Field
                      icon={<TrendingUp className="size-4" />}
                      label={<FormattedMessage id="report.field.competitors" />}
                    >
                      <div className="mt-1 flex flex-wrap gap-2">
                        {opp.competitors.map((c, ci) => (
                          <CompetitorBadge key={ci} competitor={c} />
                        ))}
                      </div>
                    </Field>
                  )}

                  {opp.domain_idea && (
                    <Field
                      icon={<Globe className="size-4" />}
                      label={<FormattedMessage id="report.field.domainIdea" />}
                    >
                      <span className="inline-block rounded-md bg-muted px-2 py-0.5 font-mono text-sm">
                        {opp.domain_idea}
                      </span>
                    </Field>
                  )}
                </CardContent>

                {opp.source_url && (
                  <CardFooter>
                    <a
                      href={opp.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    >
                      <ExternalLink className="size-3.5" />
                      <FormattedMessage id="report.viewSource" />
                    </a>
                  </CardFooter>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
