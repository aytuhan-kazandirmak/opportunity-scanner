"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";

const CELLS = [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1] as const;

const NAV_LINKS = [
  { href: "/", labelId: "nav.reports" },
  { href: "/#feed", labelId: "nav.opportunities" },
  { href: "/#tools", labelId: "nav.tools" },
  { href: "/#pricing", labelId: "nav.pricing" },
] as const;

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
  }

  const locale = intl.locale as "tr" | "en";

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-7 py-3.5 bg-brand-bg/80 backdrop-blur-md border-b border-brand-line-soft">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="grid grid-cols-4 grid-rows-4 gap-px w-7 h-7 overflow-hidden rounded-[3px]"
        >
          {CELLS.map((on, i) => (
            <span key={i} className={on ? "bg-brand-ink block" : "block"} />
          ))}
        </span>
        <span className="font-mono text-[14px] font-bold uppercase tracking-[0.02em] text-brand-ink">
          AIMARKETLENS
        </span>
      </div>

      {/* Nav links */}
      <nav className="hidden lg:flex items-center gap-1">
        {NAV_LINKS.map(({ href, labelId }) => (
          <Link
            key={href}
            href={href}
            className="px-3 py-1.5 rounded-full font-mono text-[12.5px] text-brand-ink2 hover:bg-brand-ink/[0.08] hover:text-brand-ink transition-colors duration-150"
          >
            {intl.formatMessage({ id: labelId })}
          </Link>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Lang segment — decorative, shows auto-detected locale */}
        {mounted && (
          <div className="hidden sm:flex items-center gap-px p-[2px] border border-brand-line-soft rounded-full font-mono text-[11.5px]">
            {(["tr", "en"] as const).map((lang) => (
              <span
                key={lang}
                className={`px-[10px] py-[5px] rounded-full transition-colors duration-150 ${
                  locale === lang
                    ? "bg-brand-ink text-brand-bg"
                    : "text-brand-ink3"
                }`}
              >
                {lang.toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="px-[11px] py-[7px] border border-brand-line-soft rounded-full font-mono text-[11.5px] text-brand-ink2 hover:border-brand-ink hover:text-brand-ink transition-colors duration-150"
        >
          {mounted ? (isDark ? "☀" : "☾") : "☾"}
        </button>

        {/* Sign In */}
        <button className="hidden sm:inline-flex items-center px-[11px] py-[7px] border border-brand-line-soft rounded-full font-mono text-[11.5px] text-brand-ink2 hover:border-brand-ink hover:text-brand-ink transition-colors duration-150">
          {intl.formatMessage({ id: "nav.signin" })}
        </button>

        {/* CTA */}
        <button className="inline-flex items-center gap-1 px-[11px] py-[7px] bg-brand-ink text-brand-bg border border-brand-ink rounded-full font-mono text-[11.5px] hover:bg-brand-ink2 transition-colors duration-150">
          {intl.formatMessage({ id: "nav.cta" })} →
        </button>
      </div>
    </header>
  );
}
