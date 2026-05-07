'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useIntl, FormattedMessage } from 'react-intl'

const CELLS = [1,1,1,0, 1,0,1,1, 1,1,0,1, 0,1,1,1] as const

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const intl = useIntl()

  return (
    <footer className="bg-[#1a1814] text-[#f3eee3]">
      <div className="max-w-[1440px] mx-auto px-7 lg:px-14">
        {/* Newsletter section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-[60px] py-[60px] border-b border-[#f3eee3]/10">
          <div>
            <h2 className="font-serif font-normal text-[clamp(40px,5vw,72px)] leading-[1.02] tracking-[-0.02em] mb-4 text-[#f3eee3]">
              <FormattedMessage id="home.footer.sub.h.a" />{' '}
              <span className="text-[#f3eee3]/50">
                <FormattedMessage id="home.footer.sub.h.b" />
              </span>
            </h2>
            <p className="font-mono text-[13px] text-[#f3eee3]/50 leading-[1.6]">
              <FormattedMessage id="home.footer.sub.p" />
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <form
              onSubmit={e => e.preventDefault()}
              className="flex gap-2 bg-[#f3eee3]/[0.08] border border-[#f3eee3]/20 rounded-full px-1 py-1"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={intl.formatMessage({ id: 'home.footer.sub.input.placeholder' })}
                className="flex-1 bg-transparent font-mono text-[13px] text-[#f3eee3] placeholder:text-[#f3eee3]/40 px-3 outline-none min-w-0"
              />
              <button
                type="submit"
                className="bg-brand-accent text-brand-accent-ink font-mono text-[12px] font-semibold rounded-full px-4 py-2 whitespace-nowrap hover:opacity-90 transition-opacity"
              >
                <FormattedMessage id="home.footer.sub.btn" />
              </button>
            </form>
            <p className="font-mono text-[11px] text-[#f3eee3]/40">
              <FormattedMessage id="home.footer.sub.small" />
            </p>
          </div>
        </div>

        {/* Footer grid */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 py-12 border-b border-[#f3eee3]/10">
          {/* Brand col */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span aria-hidden="true" className="grid grid-cols-4 grid-rows-4 gap-px w-7 h-7 overflow-hidden rounded-[3px]">
                {CELLS.map((on, i) => (
                  <span key={i} className={on ? 'bg-[#f3eee3] block' : 'block'} />
                ))}
              </span>
              <span className="font-mono text-[14px] font-bold uppercase tracking-[0.02em] text-[#f3eee3]">
                AI Market Lens
              </span>
            </div>
            <p className="font-mono text-[12px] text-[#f3eee3]/50 leading-[1.6] max-w-[260px]">
              <FormattedMessage id="home.footer.about" />
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#f3eee3]/50 mb-4">
              <FormattedMessage id="home.footer.product" />
            </p>
            <Link href="/" className="block text-[13px] text-[#f3eee3]/70 hover:text-brand-accent transition-colors duration-150 mb-2">
              <FormattedMessage id="home.footer.p1" />
            </Link>
            <Link href="#" className="block text-[13px] text-[#f3eee3]/70 hover:text-brand-accent transition-colors duration-150 mb-2">
              <FormattedMessage id="home.footer.p2" />
            </Link>
            <Link href="#" className="block text-[13px] text-[#f3eee3]/70 hover:text-brand-accent transition-colors duration-150 mb-2">
              <FormattedMessage id="home.footer.p3" />
            </Link>
            <Link href="#" className="block text-[13px] text-[#f3eee3]/70 hover:text-brand-accent transition-colors duration-150 mb-2">
              <FormattedMessage id="home.footer.p4" />
            </Link>
          </div>

          {/* Company */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#f3eee3]/50 mb-4">
              <FormattedMessage id="home.footer.company" />
            </p>
            <Link href="#" className="block text-[13px] text-[#f3eee3]/70 hover:text-brand-accent transition-colors duration-150 mb-2">
              <FormattedMessage id="home.footer.c1" />
            </Link>
            <Link href="#" className="block text-[13px] text-[#f3eee3]/70 hover:text-brand-accent transition-colors duration-150 mb-2">
              <FormattedMessage id="home.footer.c2" />
            </Link>
            <Link href="#" className="block text-[13px] text-[#f3eee3]/70 hover:text-brand-accent transition-colors duration-150 mb-2">
              <FormattedMessage id="home.footer.c3" />
            </Link>
            <Link href="#" className="block text-[13px] text-[#f3eee3]/70 hover:text-brand-accent transition-colors duration-150 mb-2">
              <FormattedMessage id="home.footer.c4" />
            </Link>
          </div>

          {/* Legal */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#f3eee3]/50 mb-4">
              <FormattedMessage id="home.footer.legal" />
            </p>
            <Link href="#" className="block text-[13px] text-[#f3eee3]/70 hover:text-brand-accent transition-colors duration-150 mb-2">
              <FormattedMessage id="home.footer.l1" />
            </Link>
            <Link href="#" className="block text-[13px] text-[#f3eee3]/70 hover:text-brand-accent transition-colors duration-150 mb-2">
              <FormattedMessage id="home.footer.l2" />
            </Link>
            <Link href="#" className="block text-[13px] text-[#f3eee3]/70 hover:text-brand-accent transition-colors duration-150 mb-2">
              <FormattedMessage id="home.footer.l3" />
            </Link>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="flex justify-between items-center py-6 font-mono text-[11px] text-[#f3eee3]/40">
          <span>
            <FormattedMessage id="home.footer.copyright" />
          </span>
          <span>v0.4.2</span>
        </div>
      </div>
    </footer>
  )
}
