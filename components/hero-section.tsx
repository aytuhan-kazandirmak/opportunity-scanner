"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { PixelGlobe } from "@/components/pixel-globe";

type HeroSectionProps = { reportCount: number };

export function HeroSection({ reportCount }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [globeTheme, setGlobeTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const update = () =>
      setGlobeTheme(root.dataset.theme === "dark" ? "dark" : "light");
    update();
    const obs = new MutationObserver(update);
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return (
    <section className="max-w-360  mx-auto px-7 lg:px-14 py-15 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        {/* Left: Copy */}
        <div>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-brand-ink3 px-2.5 py-1.25 border border-brand-line-soft rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand-accent)_25%,transparent)] animate-[brand-pulse_1.6s_ease-in-out_infinite]" />
            {reportCount} <FormattedMessage id="home.hero.eyebrow" />
          </div>

          {/* H1 */}
          <h1 className="font-serif font-normal text-[clamp(48px,6.2vw,54px)] 2xl:text-[clamp(48px,6.2vw,52px)] 3xl:text-[clamp(48px,6.2vw,88px)] leading-[1.04] tracking-[-0.02em] mb-8 text-balance text-brand-ink">
            {mounted ? (
              <>
                <FormattedMessage id="home.hero.h1.a" />{" "}
                <em className="not-italic text-brand-ink2">
                  <FormattedMessage id="home.hero.h1.b" />
                </em>{" "}
                <span className="bg-[linear-gradient(180deg,transparent_70%,rgb(255_107_53/0.35)_70%)]">
                  <FormattedMessage id="home.hero.h1.c" />
                </span>
              </>
            ) : (
              <span className="invisible">Loading…</span>
            )}
          </h1>

          {/* Lede */}
          <p className="text-[17px] leading-[1.55] text-brand-ink2 max-w-135 mb-8 text-pretty pr-4 text-justify">
            <FormattedMessage id="home.hero.lede" />
          </p>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap items-center mb-8 ">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4.5 py-3  rounded-full font-mono text-[13px] font-medium bg-brand-ink text-brand-bg border border-brand-ink hover:-translate-y-px transition-transform duration-150 group"
            >
              <FormattedMessage id="home.hero.cta.primary" />
              <span className="group-hover:translate-x-0.75 transition-transform duration-200">
                →
              </span>
            </Link>
            <Link
              href="/#feed"
              className="inline-flex items-center gap-2 px-4.5 py-3 rounded-full font-mono text-[13px] font-medium border border-brand-line-soft text-brand-ink hover:border-brand-ink transition-colors duration-150"
            >
              <FormattedMessage id="home.hero.cta.ghost" />
            </Link>
          </div>

          {/* Meta stats */}
          <div className="flex gap-6 flex-wrap font-mono text-[11.5px] text-brand-ink3">
            <span>
              <b className="text-brand-ink font-medium">2,847</b>{" "}
              <FormattedMessage id="home.hero.meta.opps" />
            </span>
            <span>
              <b className="text-brand-ink font-medium">180+</b>{" "}
              <FormattedMessage id="home.hero.meta.ecosystems" />
            </span>
            <span>
              <b className="text-brand-ink font-medium">92%</b>{" "}
              <FormattedMessage id="home.hero.meta.accuracy" />
            </span>
          </div>
        </div>

        {/* Right: PixelGlobe frame */}
        <div className="justify-self-center lg:justify-self-end relative hidden lg:block">
          <div
            className="relative p-[18px] border border-brand-line-soft rounded-[14px]"
            style={{
              background:
                "repeating-linear-gradient(45deg, color-mix(in oklab, var(--brand-ink) 4%, transparent) 0 1px, transparent 1px 6px)",
            }}
          >
            {/* Corner marks */}
            <span className="absolute -top-px -left-px w-3.5 h-3.5 border-t border-l border-brand-ink" />
            <span className="absolute -top-px -right-px w-3.5 h-3.5 border-t border-r border-brand-ink" />
            <span className="absolute -bottom-px -left-px w-3.5 h-3.5 border-b border-l border-brand-ink" />
            <span className="absolute -bottom-px -right-px w-3.5 h-3.5 border-b border-r border-brand-ink" />

            {/* Top stamp */}
            <div className="absolute -top-2.5 left-6 flex items-center gap-1.5 font-mono text-[10.5px] text-brand-ink bg-brand-paper px-2 py-1.25 border border-brand-line-soft whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-[brand-pulse_1.4s_ease-in-out_infinite]" />
              <FormattedMessage id="home.hero.stamp.live" />
            </div>

            {/* Canvas PixelGlobe */}
            <PixelGlobe
              size={500}
              theme={globeTheme}
              accent="#ff6b35"
              style="modern"
              speed={1}
            />

            {/* Bottom stamp */}
            <div className="absolute -bottom-2.5 right-6 font-mono text-[10.5px] text-brand-ink bg-brand-paper px-2 py-1.25 border border-brand-line-soft whitespace-nowrap">
              <FormattedMessage id="home.hero.stamp.cities" />
              {" · "}
              <b className="font-medium">
                +14 <FormattedMessage id="home.hero.stamp.opps" />
              </b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
