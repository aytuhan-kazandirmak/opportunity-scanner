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
    title: "Raporlar | AI Market Lens",
    description: "AI ve yazılım pazar açıklarının haftalık tarama raporları.",
    ...(url && { alternates: { canonical: url } }),
    openGraph: {
      title: "Raporlar | AI Market Lens",
      description: "AI ve yazılım pazar açıklarının haftalık tarama raporları.",
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
          HAFTALIK RAPORLAR · REKABET SEVİYESİNE GÖRE SIRALI
        </div>
        <h1 className="mb-4 font-mono text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          tarama <span className="text-brand-ink2">raporları.</span>
        </h1>
        <p className="mb-10 max-w-[600px] text-[15px] leading-relaxed text-brand-ink2">
          AI ve yazılım pazar açıklarının haftalık analizi. Taze GitHub
          sinyalleri, rakipsiz nişler ve solo yapılabilir SaaS fırsatları.
        </p>
        <ReportsListClient reports={reports} />
      </main>
      <SiteFooter />
    </div>
  );
}
