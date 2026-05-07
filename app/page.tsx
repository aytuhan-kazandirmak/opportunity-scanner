import type { Metadata } from 'next'
import { listReports } from '@/lib/data'
import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { TickerSection } from '@/components/ticker-section'
import { FeedSection } from '@/components/feed-section'
import { ToolsSection } from '@/components/tools-section'
import { StatsSection } from '@/components/stats-section'
import { QuotesSection } from '@/components/quotes-section'
import { SiteFooter } from '@/components/site-footer'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const description =
    'Daily AI ecosystem scanning — we surface the gaps left in the market and report them to founders. Claude Code, Cursor, Codex, and more.'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  return {
    title: { absolute: 'AI Market Lens — Daily Opportunity Scanner' },
    description,
    openGraph: {
      title: 'AI Market Lens — Daily Opportunity Scanner',
      description,
      ...(siteUrl && { url: siteUrl }),
      type: 'website',
      locale: 'en_US',
      alternateLocale: ['tr_TR'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Market Lens — Daily Opportunity Scanner',
      description,
    },
    ...(siteUrl && { alternates: { canonical: siteUrl } }),
  }
}

export default async function HomePage() {
  const reports = await listReports()
  return (
    <div className="bg-brand-bg text-brand-ink transition-colors duration-[250ms]">
      <SiteHeader />
      <HeroSection reportCount={reports.length} />
      <TickerSection />
      <FeedSection reports={reports.slice(0, 6)} />
      <ToolsSection />
      <StatsSection />
      <QuotesSection />
      <SiteFooter />
    </div>
  )
}
