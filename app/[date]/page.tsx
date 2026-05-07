import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CalendarDays } from 'lucide-react'
import { getReport, listReports } from '@/lib/data'
import { ReportDetailClient } from '@/components/report-detail-client'

export const revalidate = 86400

export async function generateStaticParams() {
  try {
    const reports = await listReports()
    return reports.map((r) => ({ date: r.scan_date }))
  } catch {
    return []
  }
}

export async function generateMetadata(props: {
  params: Promise<{ date: string }>
}): Promise<Metadata> {
  const { date } = await props.params
  const report = await getReport(date)
  const description =
    report?.summary ??
    `Opportunity scan report for ${date}. Covers fresh GitHub projects, market gaps, and solo-buildable SaaS ideas in the AI and software space.`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const reportUrl = siteUrl ? `${siteUrl}/${date}` : undefined
  return {
    title: `Scan ${date} | Opportunity Scanner`,
    description,
    openGraph: {
      title: `Opportunity Scan — ${date}`,
      description,
      ...(reportUrl && { url: reportUrl }),
      type: 'article',
      locale: 'en_US',
      alternateLocale: ['tr_TR'],
      publishedTime: report?.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Opportunity Scan — ${date}`,
      description,
    },
    ...(reportUrl && { alternates: { canonical: reportUrl } }),
  }
}

export default async function ReportDetailPage(props: {
  params: Promise<{ date: string }>
}) {
  const { date } = await props.params
  const report = await getReport(date)

  if (!report) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Opportunity Scan — ${date}`,
    datePublished: report.created_at,
    description: report.summary ?? `Opportunity scan report for ${date}`,
    inLanguage: 'en',
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-10">
        <div className="mb-3 flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="size-4" />
          <span className="font-mono text-sm">{date}</span>
        </div>
      </header>

      <ReportDetailClient report={report} />
    </main>
  )
}
