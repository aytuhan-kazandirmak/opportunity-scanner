"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import { Search } from "lucide-react";
import type { ScanReport, Opportunity } from "@/lib/schemas";

const COMP_RANK: Record<string, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
};

const COMP_BADGE: Record<string, { border: string; text: string }> = {
  none: { border: "border-[#ff6b35]/50", text: "text-[#7a2800]" },
  low: { border: "border-[#ff6b35]/40", text: "text-[#7a2800]" },
  medium: { border: "border-[#d6c089]", text: "text-[#a26d18]" },
  high: { border: "border-[#e0a994]", text: "text-[#9a3914]" },
};

type SortMode = "comp_asc" | "comp_desc";

interface Props {
  report: ScanReport;
  prevDate: string | null;
  nextDate: string | null;
}

export function ReportDetailClient({ report, prevDate, nextDate }: Props) {
  const { locale, formatMessage } = useIntl();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("comp_asc");
  const [activeTag, setActiveTag] = useState("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function localise(
    tr: string | null | undefined,
    en: string | null | undefined,
  ) {
    return mounted && locale === "en" ? (en ?? tr ?? null) : (tr ?? null);
  }

  const allTags = [
    ...new Set(report.opportunities.flatMap((o) => o.tags ?? [])),
  ];

  function compLabel(c: string) {
    if (!mounted) {
      const fallbacks: Record<string, string> = {
        none: "Rekabet yok",
        low: "Düşük rekabet",
        medium: "Orta rekabet",
        high: "Yüksek rekabet",
      };
      return fallbacks[c] ?? c;
    }
    return formatMessage({ id: `report.competition.${c}` });
  }

  const filtered = report.opportunities
    .filter((o) => {
      if (activeTag !== "all" && !(o.tags ?? []).includes(activeTag))
        return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      const text = [
        o.title,
        o.what,
        o.why_it_matters,
        o.missing_piece,
        ...(o.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    })
    .sort((a, b) => {
      const diff =
        (COMP_RANK[a.competition] ?? 0) - (COMP_RANK[b.competition] ?? 0);
      return sortMode === "comp_asc" ? diff : -diff;
    });

  const lowCompCount = report.opportunities.filter(
    (o) => o.competition === "none" || o.competition === "low",
  ).length;

  return (
    <div>
      {/* Summary card */}
      <div className="mb-8 rounded-2xl border border-brand-line-soft bg-brand-paper p-8 md:p-10">
        <div className="mb-5 flex flex-wrap justify-between gap-2 font-mono text-[11px] uppercase tracking-widest text-brand-ink3">
          <span>{report.scan_date}</span>
          <span>
            {report.opportunities.length} fırsat · {lowCompCount} düşük
            rekabet
          </span>
        </div>
        <p className="text-[17px] leading-relaxed text-brand-ink md:text-[19px]">
          {localise(report.summary, report.summary_en) ??
            "Bu rapor için özet mevcut değil."}
        </p>
      </div>

      {/* Filter chips + search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {(["all", ...allTags] as string[]).map((tag) => {
              const count =
                tag === "all"
                  ? report.opportunities.length
                  : report.opportunities.filter((o) =>
                      (o.tags ?? []).includes(tag),
                    ).length;
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11.5px] transition-colors ${
                    isActive
                      ? "border-brand-ink bg-brand-ink text-brand-bg"
                      : "border-brand-line-soft text-brand-ink2 hover:border-brand-ink hover:text-brand-ink"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      isActive ? "bg-brand-accent" : "bg-brand-ink3"
                    }`}
                  />
                  {tag === "all"
                    ? mounted
                      ? formatMessage({ id: "report.detail.filterAll" })
                      : "Hepsi"
                    : tag}{" "}
                  <span
                    className={`text-[10.5px] ${
                      isActive ? "text-brand-bg/60" : "text-brand-ink3"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <label className="flex min-w-0 flex-1 cursor-text items-center gap-2 rounded-full border border-brand-line-soft bg-brand-paper px-3 py-2 sm:min-w-[320px] sm:flex-none">
          <Search className="size-3.5 shrink-0 text-brand-ink3" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mounted
                ? formatMessage({ id: "report.detail.searchPlaceholder" })
                : "Bu haftanın fırsatlarında ara…"
            }
            className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-brand-ink outline-none placeholder:text-brand-ink3"
          />
          <kbd className="hidden shrink-0 rounded border border-brand-line-soft px-1.5 py-0.5 font-mono text-[10px] text-brand-ink3 sm:inline">
            ⌘K
          </kbd>
        </label>
      </div>

      {/* Sort bar */}
      <div className="mb-4 flex items-center justify-between border-b border-t border-brand-line-soft py-3 font-mono text-[11px] uppercase tracking-widest text-brand-ink3">
        <span>Bu haftada</span>
        <div className="flex gap-4">
          {(["comp_asc", "comp_desc"] as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`cursor-pointer transition-colors ${
                sortMode === mode
                  ? "text-brand-ink"
                  : "hover:text-brand-ink2"
              }`}
            >
              {mounted
                ? formatMessage({
                    id:
                      mode === "comp_asc"
                        ? "report.detail.sortCompAsc"
                        : "report.detail.sortCompDesc",
                  })
                : mode === "comp_asc"
                  ? "Düşük rekabet ↑"
                  : "Yüksek rekabet ↓"}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunity cards */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center font-mono text-[13px] text-brand-ink3">
          {mounted
            ? formatMessage({ id: "report.detail.noResults" })
            : "Eşleşen fırsat bulunamadı."}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((opp, i) => (
            <OpportunityCard
              key={i}
              opp={opp}
              mounted={mounted}
              formatMessage={formatMessage}
              localise={localise}
              compLabel={compLabel}
            />
          ))}
        </div>
      )}

      {/* Week navigation */}
      <div className="mt-16 flex items-center justify-between border-t border-brand-line-soft pt-6 font-mono text-[12px] text-brand-ink3">
        {prevDate ? (
          <Link
            href={`/${prevDate}`}
            className="text-brand-ink transition-colors hover:text-brand-ink2"
          >
            ← {prevDate}
          </Link>
        ) : (
          <span />
        )}
        <span>{new Date().toLocaleDateString("tr-TR")} build</span>
        {nextDate ? (
          <Link
            href={`/${nextDate}`}
            className="text-brand-ink transition-colors hover:text-brand-ink2"
          >
            {nextDate} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

interface CardProps {
  opp: Opportunity;
  mounted: boolean;
  formatMessage: ReturnType<typeof useIntl>["formatMessage"];
  localise: (
    tr: string | null | undefined,
    en: string | null | undefined,
  ) => string | null;
  compLabel: (c: string) => string;
}

function OpportunityCard({
  opp,
  mounted,
  formatMessage,
  localise,
  compLabel,
}: CardProps) {
  const badge = COMP_BADGE[opp.competition] ?? COMP_BADGE.high;

  return (
    <article className="rounded-2xl border border-brand-line-soft bg-brand-paper px-7 py-6 md:px-8">
      {/* Header */}
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] ${badge.border} ${badge.text}`}
          >
            {compLabel(opp.competition)}
          </span>
          {opp.domain_idea && (
            <span className="inline-flex items-center rounded-full border border-brand-line-soft px-2.5 py-0.5 font-mono text-[10.5px] text-brand-ink2">
              {opp.domain_idea}
            </span>
          )}
          {(opp.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-brand-line-soft px-2.5 py-0.5 font-mono text-[10.5px] text-brand-ink2"
            >
              {tag}
            </span>
          ))}
        </div>
        {opp.opportunity_score !== undefined && (
          <div className="font-mono text-[11px] uppercase tracking-widest text-brand-ink3">
            {mounted
              ? formatMessage({ id: "report.detail.score" })
              : "Fırsat puanı"}{" "}
            <b className="font-mono text-[22px] font-normal text-brand-ink">
              {opp.opportunity_score}
            </b>
            <span className="text-brand-ink3">/100</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-4 mt-1.5 text-2xl font-bold leading-snug tracking-tight text-brand-ink md:text-3xl">
        {opp.title}
      </h3>

      {/* 3-column grid */}
      <div className="grid border-t border-brand-line-soft md:grid-cols-3">
        <div className="border-brand-line-soft py-4 md:border-r md:pr-5">
          <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-widest text-brand-ink3">
            {mounted ? formatMessage({ id: "report.field.what" }) : "Ne"}
          </h4>
          <p className="text-[14px] leading-relaxed text-brand-ink2">
            {localise(opp.what, opp.what_en)}
          </p>
        </div>
        <div className="border-brand-line-soft py-4 md:border-r md:px-5">
          <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-widest text-brand-ink3">
            {mounted
              ? formatMessage({ id: "report.field.whyItMatters" })
              : "Neden Önemli"}
          </h4>
          <p className="text-[14px] leading-relaxed text-brand-ink2">
            {localise(opp.why_it_matters, opp.why_it_matters_en)}
          </p>
        </div>
        <div className="py-4 md:pl-5">
          <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-widest text-brand-ink3">
            {mounted
              ? formatMessage({ id: "report.field.missingPiece" })
              : "Eksik Parça"}
          </h4>
          <p className="text-[14px] leading-relaxed text-brand-ink2">
            {localise(opp.missing_piece, opp.missing_piece_en)}
          </p>
        </div>
      </div>

      {/* Competitors */}
      {opp.competitors && opp.competitors.length > 0 && (
        <div className="mt-4 border-t border-dashed border-brand-line-soft pt-4">
          <h4 className="mb-2.5 flex justify-between font-mono text-[10.5px] uppercase tracking-widest text-brand-ink3">
            <span>
              {mounted
                ? formatMessage({ id: "report.field.competitors" })
                : "Rakipler"}
            </span>
            <span className="text-brand-ink2">
              {opp.competitors.length}{" "}
              {mounted
                ? formatMessage({ id: "report.detail.players" })
                : "oyuncu"}
            </span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {opp.competitors.map((comp, j) => (
              <a
                key={j}
                href={comp.url ?? "#"}
                {...(comp.url
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex items-center gap-2 rounded-lg border border-brand-line-soft bg-brand-bg px-3 py-2 text-[13px] text-brand-ink transition-colors hover:border-brand-ink hover:bg-brand-paper"
              >
                <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-brand-ink font-mono text-[9px] font-semibold text-brand-bg">
                  {comp.name[0]?.toUpperCase() ?? "?"}
                </span>
                <span className="flex flex-col leading-tight">
                  <b className="text-[13px] font-medium">{comp.name}</b>
                  <small className="font-mono text-[10px] text-brand-ink3">
                    {mounted
                      ? formatMessage({
                          id: `report.competitor.type.${comp.type}`,
                        })
                      : comp.type}
                  </small>
                </span>
                {comp.url && (
                  <span className="font-mono text-[11px] text-brand-ink3">
                    ↗
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
