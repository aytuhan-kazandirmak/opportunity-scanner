"use client";

import { FormattedMessage } from "react-intl";

const STATS = [
  { numId: "home.stats.opps.num", lblId: "home.stats.opps.lbl", accent: false },
  {
    numId: "home.stats.accuracy.num",
    lblId: "home.stats.accuracy.lbl",
    accent: true,
  },
  {
    numId: "home.stats.tools.num",
    lblId: "home.stats.tools.lbl",
    accent: false,
  },
  {
    numId: "home.stats.founders.num",
    lblId: "home.stats.founders.lbl",
    accent: false,
  },
] as const;

export function StatsSection() {
  return (
    <section className="max-w-360 mx-auto px-7 lg:px-14 py-22.5 border-t border-brand-line-soft">
      {/* Section heading */}
      <div className="mb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-brand-ink3 mb-4">
          <FormattedMessage id="home.stats.tag" />
        </p>
        <h2 className="font-serif font-normal text-[clamp(34px,4vw,56px)] leading-[1.02] tracking-[-0.02em] text-brand-ink">
          <FormattedMessage id="home.stats.h.a" />{" "}
          <span className="text-brand-ink2">
            <FormattedMessage id="home.stats.h.b" />
          </span>
        </h2>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-brand-line-soft rounded-[14px] overflow-hidden bg-brand-paper">
        {STATS.map((stat, idx) => (
          <div
            key={stat.numId}
            className={`p-8 ${idx < STATS.length - 1 ? "border-r border-brand-line-soft" : ""}`}
          >
            <div className="font-serif text-[clamp(40px,5vw,64px)] leading-none tracking-[-0.03em] mb-2 text-brand-ink">
              {stat.accent ? (
                <span
                  className="text-brand-accent-ink px-1 rounded-sm"
                  style={{
                    background:
                      "color-mix(in oklab, var(--brand-accent) 30%, transparent)",
                  }}
                >
                  <FormattedMessage id={stat.numId} />
                </span>
              ) : (
                <FormattedMessage id={stat.numId} />
              )}
            </div>
            <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-brand-ink3">
              <FormattedMessage id={stat.lblId} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
