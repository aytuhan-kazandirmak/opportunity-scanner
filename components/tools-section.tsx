'use client'

import { FormattedMessage } from 'react-intl'

const TOOLS = [
  { glyph: '{ }', name: 'Claude Code', label: '247 opp' },
  { glyph: '▷',   name: 'Cursor',       label: '312 opp' },
  { glyph: '◆',   name: 'Codex',        label: '189 opp' },
  { glyph: '◐',   name: 'Windsurf',     label: '94 opp'  },
  { glyph: '▲',   name: 'v0',           label: '118 opp' },
  { glyph: '≋',   name: 'Replit Agent', label: '76 opp'  },
] as const

export function ToolsSection() {
  return (
    <section id="tools" className="max-w-[1440px] mx-auto px-14 py-[90px] border-t border-brand-line-soft">
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-brand-ink3 mb-4">
          <FormattedMessage id="home.tools.tag" />
        </p>
        <h2 className="font-serif font-normal text-[clamp(34px,4vw,56px)] leading-[1.02] tracking-[-0.02em]">
          <FormattedMessage id="home.tools.h.a" />
          {' '}
          <span className="text-brand-ink2"><FormattedMessage id="home.tools.h.b" /></span>
        </h2>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 border-t border-b border-brand-line-soft">
        {TOOLS.map((tool) => (
          <div
            key={tool.name}
            className="p-6 text-center border-r border-brand-line-soft last:border-r-0 font-mono text-[12px] hover:bg-brand-bg2 hover:text-brand-ink transition-colors duration-150 cursor-default"
          >
            <div className="text-[24px] mb-2 text-brand-ink3">{tool.glyph}</div>
            <div className="font-semibold text-brand-ink mb-1">{tool.name}</div>
            <div className="text-brand-ink3">{tool.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
