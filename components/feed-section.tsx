"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useIntl, FormattedMessage } from "react-intl";
import { report } from "process";

type ReportSummary = {
  id: string;
  scan_date: string;
  summary: string | null;
  summary_en?: string | null;
};

type FeedSectionProps = { reports: ReportSummary[] };

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

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function FeedSection({ reports }: FeedSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [activeChip, setActiveChip] = useState<FilterChip>("all");
  const [search, setSearch] = useState("");
  const intl = useIntl();
  console.log("reports", reports);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleChipClick(chip: FilterChip) {
    setActiveChip(chip);
    setSearch(chip === "all" ? "" : chip);
  }

  function handleSearchChange(val: string) {
    setSearch(val);
    setActiveChip("all");
  }

  const filtered = useMemo(() => {
    if (!search) return reports;
    const q = search.toLowerCase();
    return reports.filter(
      (r) =>
        (r.summary ?? "").toLowerCase().includes(q) ||
        (r.summary_en ?? "").toLowerCase().includes(q),
    );
  }, [reports, search]);
  console.log(reports[0].scan_date);
  return (
    <section
      id="feed"
      className="max-w-[1440px] mx-auto px-7 lg:px-14 py-[90px] border-t border-brand-line-soft"
    >
      {/* Section heading */}
      <div className="mb-10 flex justify-between items-end gap-10">
        <h2 className="font-serif font-normal text-[clamp(34px,4vw,56px)] flex flex-col leading-[1.02] tracking-[-0.02em] mb-4">
          <FormattedMessage id="home.feed.h.a" />{" "}
          <span className="text-brand-ink2">
            <FormattedMessage id="home.feed.h.b" />
          </span>
        </h2>
        <p className="text-[16px] leading-[1.55] text-brand-ink2 max-w-[380px]">
          <FormattedMessage id="home.feed.sub" />
        </p>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2 items-center mb-8">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => handleChipClick(chip)}
            className={`inline-flex items-center gap-[6px] px-3 py-1.5 rounded-full font-mono text-[11.5px] border transition-colors duration-150 ${
              activeChip === chip
                ? "bg-brand-ink text-brand-bg border-brand-ink"
                : "border-brand-line-soft text-brand-ink2 hover:border-brand-ink hover:text-brand-ink"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded- ${activeChip === chip ? "bg-brand-accent" : "bg-brand-ink3"}`}
            />
            {chip === "all" ? (
              <FormattedMessage id="home.feed.filter.all" />
            ) : chip === "General" ? (
              <FormattedMessage id="home.feed.filter.general" />
            ) : (
              chip
            )}
          </button>
        ))}
        <div className="inline-flex items-center gap-2 px-3 py-2 border border-brand-line-soft rounded-full bg-brand-paper ml-auto min-w-[280px]">
          <span className="text-brand-ink3 text-[14px] leading-none select-none">
            ⌕
          </span>
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={intl.formatMessage({
              id: "home.feed.search.placeholder",
            })}
            className="flex-1 bg-transparent font-mono text-[12px] text-brand-ink placeholder:text-brand-ink3 outline-none"
          />
          <kbd className="font-mono text-[10px] text-brand-ink3 border border-brand-line-soft rounded px-[5px] py-[2px] select-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Feed grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border border-brand-line-soft rounded-[14px] overflow-hidden bg-brand-paper">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-16 text-center font-mono text-[13px] text-brand-ink3">
            <p>
              <FormattedMessage id="home.feed.empty" />
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveChip("all");
              }}
              className="mt-3 text-brand-ink underline underline-offset-2"
            >
              <FormattedMessage id="home.feed.reset" />
            </button>
          </div>
        ) : (
          filtered.map((report, idx) => {
            const summary =
              mounted && intl.locale === "en"
                ? (report.summary_en ?? report.summary ?? "")
                : (report.summary ?? "");
            const date = mounted
              ? formatDate(report.scan_date, intl.locale)
              : report.scan_date;

            return (
              <Link
                key={report.id}
                href={`/${report.scan_date}`}
                className={`p-6 flex flex-col gap-3 border-b border-brand-line-soft hover:bg-brand-bg2 transition-colors duration-150 group ${
                  idx % 2 === 0 ? "lg:border-r lg:border-brand-line-soft" : ""
                }`}
              >
                {/* Meta */}
                <div className="flex justify-between items-center font-mono text-[10.5px] uppercase tracking-[0.06em] text-brand-ink3">
                  <span>{date}</span>
                  <span>SCAN</span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-[26px] leading-[1.1] tracking-[-0.01em] text-brand-ink">
                  {`Scan — ${report.scan_date}`}
                </h3>

                {/* Description */}
                <p className="text-[14px] leading-[1.5] text-brand-ink2 flex-1 line-clamp-3">
                  {summary}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-dashed border-brand-line-soft font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-[60px] h-[5px] bg-brand-line-soft rounded-full overflow-hidden">
                      <div className="h-full bg-brand-accent w-[70%]" />
                    </div>
                  </div>
                  <span className="text-brand-ink2 group-hover:text-brand-ink transition-colors duration-150">
                    <FormattedMessage id="home.feed.card.readmore" />
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* View all */}
      <div className="text-center mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[13px] text-brand-ink2 hover:text-brand-ink transition-colors duration-150"
        >
          <FormattedMessage id="home.feed.viewall" />
        </Link>
      </div>
    </section>
  );
}
