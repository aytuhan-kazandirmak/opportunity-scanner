"use client";

import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Scan } from "lucide-react";

type HomepageHeroProps = { reportCount: number };

export function HomepageHero({ reportCount }: HomepageHeroProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="mb-10 pb-10 border-b border-border">
      {/* Brand badge */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <Scan className="size-3.5" />
        <FormattedMessage id="home.hero.badge" />
      </div>

      {/* H1 tagline — null on SSR to prevent hydration mismatch */}
      <h1 className="mb-3 text-4xl font-bold tracking-tight leading-tight">
        {mounted ? <FormattedMessage id="home.hero.tagline" /> : null}
      </h1>

      {/* Description */}
      <p className="mb-8 max-w-prose text-base leading-relaxed text-muted-foreground">
        <FormattedMessage id="home.hero.description" />
      </p>

      {/* Stat box */}
      <div className="inline-flex items-center gap-2.5 rounded-lg border border-border bg-muted px-4 py-2.5">
        <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
          {reportCount}
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">
            <FormattedMessage
              id="home.hero.stat.reports"
              values={{ count: reportCount }}
            />
          </span>
          <span className="text-xs text-muted-foreground">
            <FormattedMessage id="home.hero.stat.label" />
          </span>
        </div>
      </div>
    </section>
  );
}
