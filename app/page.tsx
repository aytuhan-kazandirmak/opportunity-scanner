import type { Metadata } from "next";
import { listReports, getReport } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { TickerSection } from "@/components/ticker-section";
import { FeedSection } from "@/components/feed-section";
import { ToolsSection } from "@/components/tools-section";
import { StatsSection } from "@/components/stats-section";
import { QuotesSection } from "@/components/quotes-section";
import { SiteFooter } from "@/components/site-footer";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const description =
    "Weekly AI business opportunities from Claude Code, Cursor, Codex, Windsurf and 15+ tools. Discover market gaps, startup ideas, competitive analysis — and find the AI tools that already compete in each space.";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    title: { absolute: "AI Market Lens — Weekly AI Tools Opportunity Reports" },
    description,
    openGraph: {
      title: "AI Market Lens — Weekly AI Tools Opportunity Reports",
      description,
      ...(siteUrl && { url: siteUrl }),
      type: "website",
      locale: "en_US",
      alternateLocale: ["tr_TR"],
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Market Lens — Weekly AI Tools Opportunity Reports",
      description,
    },
    ...(siteUrl && { alternates: { canonical: siteUrl } }),
  };
}

export default async function HomePage() {
  const reports = await listReports();
  const latestDate = reports[0]?.scan_date;
  const latestScan = latestDate ? await getReport(latestDate) : null;
  const opportunities = latestScan?.opportunities ?? [];

  return (
    <div className="bg-brand-bg text-brand-ink transition-colors duration-250">
      <SiteHeader />
      <HeroSection reportCount={reports?.[0]?.opp_count} />
      <TickerSection />
      <FeedSection opportunities={opportunities} scanDate={latestDate ?? ""} />
      <ToolsSection />
      <StatsSection />
      <QuotesSection />
      <SiteFooter />
    </div>
  );
}
