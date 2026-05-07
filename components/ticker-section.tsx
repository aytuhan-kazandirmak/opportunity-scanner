const TOOLS = [
  'Claude Code', 'Cursor', 'Codex', 'Windsurf', 'v0',
  'Replit Agent', 'Copilot', 'Bolt', 'Lovable', 'Devin',
  'Aider', 'Continue', 'Cline', 'Zed AI', 'Supermaven',
]
const DOUBLED = [...TOOLS, ...TOOLS]

export function TickerSection() {
  return (
    <div aria-hidden="true" className="border-t border-b border-brand-line-soft bg-brand-bg2 overflow-hidden py-3">
      <div className="flex gap-9 whitespace-nowrap w-max animate-[brand-tick_40s_linear_infinite]">
        {DOUBLED.map((tool, i) => (
          <span key={i} className="inline-flex items-center gap-2 font-mono text-[12px] text-brand-ink2">
            <span className="w-[5px] h-[5px] rounded-full bg-brand-accent" />
            {tool}
          </span>
        ))}
      </div>
    </div>
  )
}
