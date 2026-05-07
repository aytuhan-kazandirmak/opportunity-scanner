import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getReport, listReports } from '@/lib/data'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ReportDetailClient } from '@/components/report-detail-client'

export const revalidate = 86400

function getISOWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const thursday = new Date(date)
  thursday.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  const firstThursday = new Date(thursday.getFullYear(), 0, 4)
  return (
    1 +
    Math.round(
      ((thursday.getTime() - firstThursday.getTime()) / 86400000 -
        3 +
        ((firstThursday.getDay() + 6) % 7)) /
        7,
    )
  )
}

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
  const week = getISOWeek(date)
  const year = date.split('-')[0]
  return {
    title: `${year} · Hafta ${week} | AI Market Lens`,
    description,
    openGraph: {
      title: `${year} · Hafta ${week} — AI Market Lens`,
      description,
      ...(reportUrl && { url: reportUrl }),
      type: 'article',
      locale: 'en_US',
      alternateLocale: ['tr_TR'],
      publishedTime: report?.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${year} · Hafta ${week} — AI Market Lens`,
      description,
    },
    ...(reportUrl && { alternates: { canonical: reportUrl } }),
  }
}

export default async function ReportDetailPage(props: {
  params: Promise<{ date: string }>
}) {
  const { date } = await props.params
  const [report, allReports] = await Promise.all([getReport(date), listReports()])

  if (!report) notFound()

  const idx = allReports.findIndex((r) => r.scan_date === date)
  const prevDate = allReports[idx + 1]?.scan_date ?? null
  const nextDate = allReports[idx - 1]?.scan_date ?? null

  const week = getISOWeek(date)
  const year = date.split('-')[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${year} · Hafta ${week} tarama raporu`,
    datePublished: report.created_at,
    description: report.summary ?? `Opportunity scan report for ${date}`,
    inLanguage: 'tr',
  }

  return (
    <div className="bg-brand-bg text-brand-ink min-h-screen">
      <SiteHeader />
      <main className="mx-auto px-6 py-16 md:px-14" style={{ maxWidth: 1080 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Breadcrumb */}
        <nav className="mb-3 font-mono text-[11px] tracking-wider text-brand-ink3">
          <Link href="/reports" className="hover:text-brand-ink transition-colors">
            Raporlar
          </Link>
          {' '}·{' '}
          <span>{year} · Hafta {week}</span>
        </nav>

        {/* Page heading */}
        <h1 className="mb-7 font-mono text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          {year} · Hafta {week}{' '}
          <em className="not-italic text-brand-ink2">tarama raporu.</em>
        </h1>

        <ReportDetailClient
          report={report}
          prevDate={prevDate}
          nextDate={nextDate}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
