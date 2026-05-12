"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import { Search } from "lucide-react";
import type { ListReport } from "@/lib/data";

function getWeekOfMonth(dateStr: string): { week: number; total: number } {
  const [y, m, d] = dateStr.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  return {
    week: Math.ceil(d / 7),
    total: Math.ceil(daysInMonth / 7),
  };
}

function getMonthAbbr(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(
    locale === "en" ? "en-US" : "tr-TR",
    { month: "short" },
  );
}

const FILTER_CHIPS = [
  "all",
  "Claude Code",
  "Cursor",
  "Codex",
  "Windsurf",
  "v0",
  "Replit Agent",
  "General",
] as const;
type FilterChip = (typeof FILTER_CHIPS)[number];

type SortMode = "newest" | "low_comp" | "high_comp" | "count_desc";

function CompBar({
  oppCount,
  lowCount,
}: {
  oppCount: number;
  lowCount: number;
}) {
  const ratio = oppCount > 0 ? lowCount / oppCount : 0;
  const pct = Math.round(ratio * 100);

  let fill = "bg-brand-warn";
  let label = "Yüksek";
  if (ratio >= 0.7) {
    fill = "bg-brand-accent";
    label = "Düşük";
  } else if (ratio >= 0.4) {
    fill = "bg-[#e3a93b]";
    label = "Orta";
  }

  return (
    <div className="flex flex-col gap-1.5 font-mono text-[10.5px] uppercase tracking-widest text-brand-ink3">
      <span>{label} rekabet</span>
      <div className="h-[5px] w-full overflow-hidden rounded-full bg-brand-line-soft">
        <div
          className={`h-full rounded-full ${fill}`}
          style={{ width: `${Math.max(pct, 8)}%` }}
        />
      </div>
    </div>
  );
}

export function ReportsListClient({ reports }: { reports: ListReport[] }) {
  const { locale, formatMessage } = useIntl();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [activeChip, setActiveChip] = useState<FilterChip>("all");
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

  function localise(tr: string | null, en: string | null | undefined) {
    return mounted && locale === "en" ? (en ?? tr) : tr;
  }

  const chipCounts = useMemo(() => {
    const counts: Record<string, number> = { all: reports.length };
    for (const r of reports) {
      if (r.tool_tags.length === 0) {
        counts["General"] = (counts["General"] ?? 0) + 1;
      }
      for (const t of r.tool_tags) {
        counts[t] = (counts[t] ?? 0) + 1;
      }
    }
    return counts;
  }, [reports]);

  function handleChipClick(chip: FilterChip) {
    setActiveChip(chip);
    setQuery(chip === "all" ? "" : chip);
  }

  function handleSearchChange(val: string) {
    setQuery(val);
    setActiveChip("all");
  }

  function handleReset() {
    setQuery("");
    setActiveChip("all");
  }

  const filtered = useMemo(
    () =>
      reports
        .filter((r) => {
          if (activeChip !== "all") {
            if (activeChip === "General") {
              if (r.tool_tags.length !== 0) return false;
            } else {
              if (!r.tool_tags.includes(activeChip)) return false;
            }
          }
          if (!query.trim()) return true;
          const q = query.toLowerCase();
          const text = [
            r.scan_date,
            localise(r.summary, r.summary_en) ?? "",
            ...r.tool_tags,
          ]
            .join(" ")
            .toLowerCase();
          return text.includes(q);
        })
        .sort((a, b) => {
          if (sortMode === "newest")
            return -a.scan_date.localeCompare(b.scan_date);
          if (sortMode === "count_desc") return b.opp_count - a.opp_count;
          const ratioA = a.opp_count > 0 ? a.low_comp_count / a.opp_count : 0;
          const ratioB = b.opp_count > 0 ? b.low_comp_count / b.opp_count : 0;
          if (sortMode === "low_comp") return ratioB - ratioA;
          return ratioA - ratioB; // high_comp
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reports, activeChip, query, sortMode, mounted, locale],
  );

  const sortOptions: { mode: SortMode; label: string }[] = [
    { mode: "low_comp", label: formatMessage({ id: "reports.sortLowComp" }) },
    { mode: "high_comp", label: formatMessage({ id: "reports.sortHighComp" }) },
    { mode: "newest", label: formatMessage({ id: "reports.sortNewest" }) },
    {
      mode: "count_desc",
      label: formatMessage({ id: "reports.sortOppCount" }),
    },
  ];

  return (
    <div>
      {/* Filter chips — yatay kaydırılabilir */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeChip === chip;
          return (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-[6px] rounded-full border px-3 py-1.5 font-mono text-[11.5px] transition-colors duration-150 ${
                isActive
                  ? "border-brand-ink bg-brand-ink text-brand-bg"
                  : "border-brand-line-soft text-brand-ink2 hover:border-brand-ink hover:text-brand-ink"
              }`}
            >
              <span
                className={`size-1.5 ${isActive ? "bg-brand-accent" : "bg-brand-ink3"}`}
              />
              {chip === "all"
                ? formatMessage({ id: "reports.filterAll" })
                : chip === "General"
                  ? formatMessage({ id: "home.feed.filter.general" })
                  : chip}
              <span
                className={`border-l border-[#c9bfa9] pl-1 text-[10px] ${isActive ? "text-brand-bg/60" : "text-brand-ink3"}`}
              >
                264
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <label className="mb-6 flex w-full items-center gap-2 rounded-full border border-brand-line-soft bg-brand-paper px-3 py-2 sm:w-auto sm:min-w-[280px]">
        <Search className="size-3.5 shrink-0 text-brand-ink3" />
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={
            mounted
              ? formatMessage({ id: "reports.searchPlaceholder" })
              : "Rapor, fırsat veya etiket ara…"
          }
          className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-brand-ink outline-none placeholder:text-brand-ink3"
        />
        <kbd className="hidden shrink-0 rounded border border-brand-line-soft px-1.5 py-0.5 font-mono text-[10px] text-brand-ink3 sm:inline">
          ⌘K
        </kbd>
      </label>

      {/* Sort bar */}
      <div className="mb-1 overflow-x-auto border-b border-t border-brand-line-soft">
        <div className="flex min-w-max items-center justify-end gap-1 py-2 font-mono text-[11px] uppercase tracking-widest text-brand-ink3">
          {sortOptions.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`cursor-pointer px-2 py-1 uppercase transition-colors ${
                sortMode === mode
                  ? "text-brand-ink"
                  : "text-brand-ink3 hover:text-brand-ink2"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Week rows */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center font-mono text-[13px] text-brand-ink3">
          {reports.length === 0 ? (
            <p>
              {mounted
                ? formatMessage({ id: "reports.noReports" })
                : "Henüz rapor yok."}
            </p>
          ) : (
            <>
              <p>{formatMessage({ id: "reports.noResults" })}</p>
              <button
                onClick={handleReset}
                className="mt-3 text-brand-ink underline underline-offset-2"
              >
                {formatMessage({ id: "reports.resetFilters" })}
              </button>
            </>
          )}
        </div>
      ) : (
        <ul>
          {filtered.map((report) => {
            const { week, total } = getWeekOfMonth(report.scan_date);
            const year = report.scan_date.slice(0, 4);
            const summaryText =
              localise(report.summary, report.summary_en) ?? "";
            const words = summaryText.trim().split(/\s+/);
            const title =
              words.length > 8
                ? words.slice(0, 8).join(" ") + "…"
                : summaryText;
            const visibleTags = report.tool_tags.slice(0, 3);
            const extraCount = report.tool_tags.length - visibleTags.length;

            return (
              <li key={report.id} className="border-b border-brand-line-soft">
                <Link
                  href={`/${report.scan_date}`}
                  className="group grid cursor-pointer items-center gap-4 py-5 transition-colors hover:bg-brand-bg2 [grid-template-columns:80px_1fr_32px] md:gap-6 md:[grid-template-columns:120px_1fr_180px_110px_32px]"
                >
                  {/* Col 1: Date */}
                  <div className="font-mono text-[11px] tracking-wider text-brand-ink3">
                    <b className="mb-0.5 block text-[14px] font-semibold tracking-normal text-brand-ink">
                      {mounted
                        ? getMonthAbbr(report.scan_date, locale)
                        : report.scan_date.slice(5, 7)}{" "}
                      {week}/{total}
                    </b>
                    <span>{year}</span>
                  </div>

                  {/* Col 2: Title + tags */}
                  <div>
                    <p className="mb-2 text-lg font-semibold leading-snug tracking-tight text-brand-ink line-clamp-1">
                      {title || `${year} · Hafta ${week}`}
                    </p>
                    {(report.has_hot || visibleTags.length > 0) && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {report.has_hot && (
                          <span className="rounded-full bg-brand-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-brand-accent-ink">
                            HOT
                          </span>
                        )}
                        {visibleTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-brand-line-soft px-2 py-0.5 font-mono text-[10px] tracking-wide text-brand-ink3"
                          >
                            {tag}
                          </span>
                        ))}
                        {extraCount > 0 && (
                          <span className="rounded-full border border-brand-line-soft px-2 py-0.5 font-mono text-[10px] tracking-wide text-brand-ink3">
                            +{extraCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Col 3: Competition bar */}
                  <div className="hidden md:block">
                    <CompBar
                      oppCount={report.opp_count}
                      lowCount={report.low_comp_count}
                    />
                  </div>

                  {/* Col 4: Opportunity count */}
                  <div className="hidden text-right font-mono text-[11px] uppercase tracking-widest text-brand-ink3 md:block">
                    <b className="block font-mono text-[30px] font-normal leading-none text-brand-ink">
                      {report.opp_count}
                    </b>
                    {formatMessage({ id: "reports.card.opps" })}
                  </div>

                  {/* Col 5: Arrow */}
                  <span className="font-mono text-lg text-brand-ink3 transition-transform group-hover:translate-x-1 group-hover:text-brand-ink">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
