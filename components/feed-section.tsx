"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useIntl, FormattedMessage } from "react-intl";
import type { Opportunity } from "@/lib/schemas";

type FeedSectionProps = {
  opportunities: Opportunity[];
  scanDate: string;
};

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

const TOOL_TAGS = [
  "Claude Code",
  "Cursor",
  "Codex",
  "Windsurf",
  "v0",
  "Replit Agent",
] as const;

function extractTag(opp: Opportunity): string {
  const text = `${opp.title} ${opp.what}`.toLowerCase();
  return TOOL_TAGS.find((t) => text.includes(t.toLowerCase())) ?? "General";
}

function competitionScore(c: Opportunity["competition"]): number {
  return { none: 95, low: 75, medium: 50, high: 25 }[c];
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function scanNumber(date: string): string {
  return date.replace(/-/g, "").slice(2);
}

export function FeedSection({ opportunities, scanDate }: FeedSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [activeChip, setActiveChip] = useState<FilterChip>("all");
  const [search, setSearch] = useState("");
  const intl = useIntl();

  useEffect(() => {
    setMounted(true);
  }, []);

  const chipCounts = useMemo(() => {
    const counts: Record<string, number> = { all: opportunities.length };
    for (const opp of opportunities) {
      const tag = extractTag(opp);
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
    return counts;
  }, [opportunities]);

  function handleChipClick(chip: FilterChip) {
    setActiveChip(chip);
    setSearch(chip === "all" ? "" : chip);
  }

  function handleSearchChange(val: string) {
    setSearch(val);
    setActiveChip("all");
  }

  const filtered = useMemo(() => {
    let list = opportunities;
    if (activeChip !== "all") {
      list = list.filter((o) => extractTag(o) === activeChip);
    }
    if (search && activeChip === "all") {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.what.toLowerCase().includes(q) ||
          (o.what_en ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [opportunities, activeChip, search]);

  const rapor = scanNumber(scanDate);

  return (
    <section
      id="feed"
      className="max-w-360 mx-auto px-7 lg:px-14 py-22.5 border-t border-brand-line-soft"
    >
      {/* Section heading */}
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-brand-ink3 mb-4">
          <FormattedMessage id="home.feed.tag" />
        </p>
        <h2 className="font-serif font-normal text-[clamp(34px,4vw,56px)] leading-[1.02] tracking-[-0.02em] mb-4">
          <FormattedMessage id="home.feed.h.a" />{" "}
          <span className="text-brand-ink2">
            <FormattedMessage id="home.feed.h.b" />
          </span>
        </h2>
        <p className="text-[16px] leading-[1.55] text-brand-ink2 max-w-[600px]">
          <FormattedMessage id="home.feed.sub" />
        </p>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2 items-center mb-8">
        {FILTER_CHIPS.map((chip) => {
          const count = chip === "all" ? chipCounts["all"] : chipCounts[chip];
          return (
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
                className={`w-1.5 h-1.5 rounded-sm ${activeChip === chip ? "bg-brand-accent" : "bg-brand-ink3"}`}
              />
              {chip === "all" ? (
                <FormattedMessage id="home.feed.filter.all" />
              ) : chip === "General" ? (
                <FormattedMessage id="home.feed.filter.general" />
              ) : (
                chip
              )}
              {/* {count != null && count > 0 && (
                <span
                  className={`text-[10px] text-center border-l pl-1 border-solid border-[#c9bfa9] ${activeChip === chip ? "text-brand-bg/60" : "text-brand-ink3"}`}
                >
                  {count}
                </span>
              )} */}
              <span
                className={`text-[10px] text-center border-l pl-1 border-solid border-[#c9bfa9] ${activeChip === chip ? "text-brand-bg/60" : "text-brand-ink3"}`}
              >
                264
              </span>
            </button>
          );
        })}
        <div className="inline-flex items-center gap-2 px-3 py-2 border border-brand-line-soft rounded-full bg-brand-paper ml-auto w-full md:max-w-80">
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
          <kbd className="font-mono text-[10px] text-brand-ink3 border border-brand-line-soft rounded px-1.25 py-0.5 select-none">
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
          filtered.map((opp, idx) => {
            const tag = extractTag(opp);
            const isHot =
              opp.competition === "none" || opp.competition === "low";
            const score = competitionScore(opp.competition);
            const what =
              mounted && intl.locale === "en"
                ? (opp.what_en ?? opp.what)
                : opp.what;

            return (
              <Link
                key={idx}
                href={`/${scanDate}`}
                className={`p-6 flex flex-col gap-3 border-b border-brand-line-soft hover:bg-brand-bg2 transition-colors duration-150 group ${
                  idx % 2 === 0 ? "lg:border-r lg:border-brand-line-soft" : ""
                }`}
              >
                {/* Top row: tag + rapor number */}
                <div className="flex justify-between items-center">
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-[3px] rounded-full border ${
                      isHot
                        ? "bg-brand-accent text-brand-accent-ink border-transparent"
                        : "border-brand-line-soft text-brand-ink3"
                    }`}
                  >
                    {tag}
                    {isHot ? " · HOT" : ""}
                  </span>
                  <span className="font-mono text-[10.5px] text-brand-ink3 uppercase tracking-[0.06em]">
                    RAPOR #{rapor}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-[26px] leading-[1.1] tracking-[-0.01em] text-brand-ink">
                  {opp.title}
                </h3>

                {/* What — truncated */}
                <p className="text-[14px] leading-[1.5] text-brand-ink2 flex-1 line-clamp-3">
                  {what}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-dashed border-brand-line-soft font-mono text-[11px]">
                  {/* Score bar */}
                  <span className="flex items-center gap-2">
                    <div className="w-[60px] h-[5px] bg-brand-line-soft rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-accent rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-brand-ink3">{score}/100</span>
                  </span>

                  {/* Competitor initials + read more */}
                  <span className="flex items-center gap-1.5">
                    {(opp.competitors ?? []).slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="w-[22px] h-[22px] rounded-full border border-brand-line-soft flex items-center justify-center font-mono text-[9px] text-brand-ink3"
                        title={c.name}
                      >
                        {initials(c.name)}
                      </span>
                    ))}
                    <span className="text-brand-ink2 group-hover:text-brand-ink transition-colors duration-150 ml-1">
                      <FormattedMessage id="home.feed.card.readmore" />
                    </span>
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
