'use client'

import { FormattedMessage } from 'react-intl'

const QUOTES = [
  { qId: 'home.quotes.q1', whoId: 'home.quotes.q1.who', name: 'Ece Korkmaz',   initials: 'EK' },
  { qId: 'home.quotes.q2', whoId: 'home.quotes.q2.who', name: 'Daniel Mwangi', initials: 'DM' },
  { qId: 'home.quotes.q3', whoId: 'home.quotes.q3.who', name: 'Sara Romano',   initials: 'SR' },
] as const

export function QuotesSection() {
  return (
    <section className="max-w-[1440px] mx-auto px-7 lg:px-14 py-[90px] border-t border-brand-line-soft">
      {/* Section heading */}
      <div className="mb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-brand-ink3 mb-4">
          <FormattedMessage id="home.quotes.tag" />
        </p>
        <h2 className="font-serif font-normal text-[clamp(34px,4vw,56px)] leading-[1.02] tracking-[-0.02em] text-brand-ink">
          <FormattedMessage id="home.quotes.h.a" />{' '}
          <span className="text-brand-ink2">
            <FormattedMessage id="home.quotes.h.b" />
          </span>
        </h2>
      </div>

      {/* Quotes grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[18px]">
        {QUOTES.map(q => (
          <div
            key={q.qId}
            className="p-7 border border-brand-line-soft rounded-[14px] bg-brand-paper flex flex-col gap-5"
          >
            <span className="font-serif text-[64px] leading-[0.6] text-brand-accent select-none" aria-hidden="true">
              &quot;
            </span>
            <p className="font-serif text-[22px] leading-[1.25] flex-1 text-pretty text-brand-ink">
              <FormattedMessage id={q.qId} />
            </p>
            <div className="flex gap-3 items-center border-t border-dashed border-brand-line-soft pt-4">
              <span className="w-8 h-8 rounded-full bg-brand-ink text-brand-bg grid place-items-center font-mono text-[11px] font-semibold shrink-0">
                {q.initials}
              </span>
              <div className="font-mono text-[11px] leading-[1.4]">
                <b className="text-brand-ink block font-medium">{q.name}</b>
                <span className="text-brand-ink3">
                  <FormattedMessage id={q.whoId} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
