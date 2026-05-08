import type { Metadata } from "next";
import { listReports } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReportsListClient } from "@/components/reports-list-client";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const url = siteUrl ? `${siteUrl}/reports` : undefined;
  return {
    title: "Haftalık AI Fırsatları | AI Market Lens",
    description: "Her hafta AI araçlarındaki pazar boşluklarını ve iş fırsatlarını analiz ediyoruz. Claude Code, Cursor, Codex, Windsurf için rekabet analizi ve startup fikirleri.",
    ...(url && { alternates: { canonical: url } }),
    openGraph: {
      title: "Haftalık AI Fırsatları | AI Market Lens",
      description: "Her hafta AI araçlarındaki pazar boşluklarını ve iş fırsatlarını analiz ediyoruz. Claude Code, Cursor, Codex, Windsurf için rekabet analizi ve startup fikirleri.",
      ...(url && { url }),
      type: "website",
    },
  };
}

export default async function ReportsPage() {
  const reports = await listReports();

  return (
    <div className="bg-brand-bg text-brand-ink min-h-screen">
      <SiteHeader />
      <main className="max-w-360 mx-auto px-7 lg:px-14 py-[60px] border-t border-brand-line-soft">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-line-soft px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-brand-ink3">
          <span
            className="size-1.5 rounded-full bg-brand-accent"
            style={{ animation: "brand-pulse 1.6s ease-in-out infinite" }}
          />
          HAFTALIK AI FIRSATLARI · RAKİP ANALİZİ
        </div>
        <h1 className="mb-4 font-mono text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          fırsat <span className="text-brand-ink2">raporları.</span>
        </h1>
        <p className="mb-10 max-w-[600px] text-[15px] leading-relaxed text-brand-ink2">
          Claude Code, Cursor, Codex, Windsurf ve 15+ AI aracındaki pazar
          boşluklarını her hafta analiz ediyoruz. İş fırsatları, rakip haritası
          ve eksik parçalar — kurucular için.
        </p>
        <ReportsListClient reports={reports} />
      </main>
      <SiteFooter />
    </div>
  );
}
