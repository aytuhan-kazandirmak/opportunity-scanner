'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useIntl, FormattedMessage } from 'react-intl'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, ArrowRight, CalendarDays, Inbox, Scroll } from 'lucide-react'
import type { ScanReport } from '@/lib/schemas'

type ReportSummary = Pick<ScanReport, 'id' | 'scan_date' | 'summary' | 'summary_en'>

function formatDate(dateStr: string, locale: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(
    locale === 'en' ? 'en-US' : 'tr-TR',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

export function ReportsListClient({ reports }: { reports: ReportSummary[] }) {
  const { locale } = useIntl()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  function localise(tr: string | null, en: string | null | undefined) {
    return mounted && locale === 'en' ? (en ?? tr) : tr
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <div className="mb-3 flex items-center gap-2 text-muted-foreground">
          <Activity className="size-4" />
          <span className="text-sm font-medium">
            <FormattedMessage id="reports.marketIntelligence" />
          </span>
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          <FormattedMessage id="reports.heading" />
        </h1>

        <p className="text-base leading-relaxed text-muted-foreground">
          <FormattedMessage id="reports.description" />
        </p>

        {reports.length > 0 && (
          <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
              <Scroll className="size-3.5 text-muted-foreground" />
              <FormattedMessage id="reports.count" values={{ count: reports.length }} />
            </span>
          </div>
        )}
      </header>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-muted-foreground">
          <Inbox className="size-10 opacity-40" />
          <p className="text-sm">
            <FormattedMessage id="reports.noReports" />
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {reports.map((report) => (
            <li key={report.id}>
              <Link href={`/reports/${report.scan_date}`} className="group block">
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="size-4" />
                        <span className="font-mono text-xs">{report.scan_date}</span>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>

                    <CardTitle className="text-base">
                      {mounted ? formatDate(report.scan_date, locale) : formatDate(report.scan_date, 'tr')}
                    </CardTitle>

                    {localise(report.summary, report.summary_en) && (
                      <CardDescription className="line-clamp-2">
                        {localise(report.summary, report.summary_en)}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
