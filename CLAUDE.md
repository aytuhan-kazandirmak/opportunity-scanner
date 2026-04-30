# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Opportunity Scanner

## Purpose

I am a frontend developer and entrepreneur. This tool helps me find market gaps and opportunities in the software/AI space before others do.

## My Profile

- Frontend dev (React, TypeScript, Tailwind)
- Can ship a SaaS product solo in weeks
- Target market: global, Turkish market as differentiator when relevant
- Goal: find gaps, build fast, monetize

## Daily Scan Instructions

When I say "run scan" or "/scan", do the following:

### 1. GitHub Search (use github mcp)

- Search repos created in last 7 days with topics: "claude", "mcp", "anthropic", "ai-agent"
- Sort by stars, list top 10
- Note: star count, what it does, what's MISSING (no UI, no hosted version, no SaaS wrapper)

### 2. Anthropic News (use tavily)

- Search: "anthropic claude new feature announcement"
- Search: "claude MCP new server released this week"
- Search: "site:news.ycombinator.com Show HN claude OR anthropic"

### 3. Gap Analysis

For each finding answer:

- What was just released?
- What problem does it solve?
- What's missing around it? (UI, marketplace, hosted version, Turkish localization)
- How fast can a solo frontend dev ship something? (days / weeks / months)
- Competition level: (none / low / medium / high)

### 4. Verification (MANDATORY - run after every scan)

For each opportunity found, use tavily to verify:

- Is this real? Find the actual announcement or source link.
- When exactly was it released?
- Does a product already exist that solves this gap?

Mark each item as:

- ✅ Verified — source link found, claim confirmed
- ⚠️ Unverified — no source found, treat with caution
- ❌ Remove — hallucinated or already solved

Do NOT include any item in the final report without a verification status.

## Output Format

### Step 1 — Save markdown report

Save report as: `reports/YYYY-MM-DD.md`

### 🚀 Fresh Opportunities (< 2 weeks old)

### 📈 Growing Gaps (demand exists, no good solution yet)

### ⚡ Build This Week (solo dev, <1 week to ship)

### ⚠️ Too Late (already crowded, skip)

### 💡 Wild Cards (unexpected angles)

Each item format:

- **Verification:** ✅ / ⚠️ / ❌ + source link
- **What:** 3-4 sentences. What exactly was released, by whom, and when. What does it do technically? Who is the intended user? What does it replace or enable that wasn't possible before?
- **Why it matters:** 3-4 sentences. What specific problem does this solve, and for how many people? Is there a clear trend or wave this is riding (AI tooling, MCP ecosystem, etc.)? Are there comparable products that already found product-market fit in adjacent spaces? What makes the timing right now vs. 6 months ago?
- **Missing piece:** 3-4 sentences. Describe the gap as concretely as possible — not "no UI" but "developers must configure this via JSON files with no validation or preview; a visual editor would remove the main friction point." Why hasn't someone built this yet? What would the MVP look like, and who would pay for it first?
- **Verdict:** One honest sentence. Is this a real opportunity worth exploring, or does it sound better than it is? Flag any red flags (niche too small, problem already solved, requires audience the builder doesn't have).
- **Build time:** days / weeks
- **Competition:** none / low / medium / high
- **Domain idea:** example domain name

### Step 2 — Save to database (MANDATORY after every scan)

After saving the markdown, POST to the API:

1. Read `REPORT_API_KEY` from `.env.local`
2. Build the JSON payload:

```json
{
  "scan_date": "YYYY-MM-DD",
  "summary": "2-3 sentence summary of today's most important findings",
  "opportunities": [
    {
      "verification": "verified | unverified | hallucinated",
      "source_url": "https://...",
      "what": "3-4 sentence description of what was released, by whom, and what it enables",
      "why_it_matters": "3-4 sentence market signal — problem size, timing, comparable successes",
      "missing_piece": "3-4 sentence concrete gap description — what exactly is missing and why",
      "verdict": "one honest sentence on whether this is worth pursuing",
      "build_time": "X days / X weeks",
      "competition": "none | low | medium | high",
      "domain_idea": "example.com",
      "category": "fresh | growing | build_this_week | too_late | wild_card"
    }
  ]
}
```

3. Write the JSON payload to a temp file and POST it (avoids Windows terminal encoding issues with Turkish characters):

```bash
# Write payload to file first — ensures UTF-8 encoding
cat > /tmp/scan_payload.json << 'ENDJSON'
<JSON payload>
ENDJSON

curl -X POST http://localhost:3000/api/save-report \
  -H "x-api-key: <REPORT_API_KEY>" \
  -H "Content-Type: application/json" \
  --data-binary @/tmp/scan_payload.json
```

4. Confirm with `{"id":"...","scan_date":"..."}` response. If it fails, show the error.

---

## Stack (SaaS Dashboard)

Next.js 16.2.4 (App Router) + Supabase + TypeScript + Tailwind v4 + Vercel

### Current Project State

The app is bootstrapped from `create-next-app`. The following directories do not exist yet and must be created when needed:
- `lib/` — data layer (`lib/data.ts`, `lib/schemas.ts`, `lib/types/database.ts`)
- `supabase/migrations/` — DB migrations
- `app/reports/` — report list and detail pages
- `components/` — shared UI components

### Rendering
- Static pages: SSG
- Report list: ISR revalidate:3600
- Report detail: ISR revalidate:86400
- Admin only: CSR

### Rules
- Database: all DB calls via `lib/data.ts` — never call supabase client directly in components
- Styles: Tailwind v4 + shadcn/ui only — no custom CSS. Install shadcn: `npx shadcn@latest add <component>`
- Images: always `next/image` — never `<img>`
- Font: `next/font` (currently Geist/Geist_Mono via `next/font/google`)
- Types: `strict: true` — no `as` assertions, no `any`. All Supabase responses parsed with Zod.
- Path alias: `@/` maps to the project root (not `./src/`)

### Tailwind v4 Notes

This project uses **Tailwind CSS v4**, which is CSS-first and has no `tailwind.config.js`:
- Tokens are defined with `@theme inline { ... }` in `app/globals.css`
- Configuration goes inside the CSS file — do not create `tailwind.config.js`
- Import is `@import "tailwindcss"` (not `@tailwind base/components/utilities`)

### Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Type check: `npx tsc --noEmit`
- Lint: `npm run lint`

## Supabase

- `project_ref` = `kbdoznmfugyzavkpsfic` — always specify when using MCP
- RLS enabled on all tables — every migration must include RLS policies
- `lib/data.ts` functions are wrapped with `cache()` — do not duplicate fetches
- All responses validated with Zod schemas in `lib/schemas.ts`

### Schema (`scan_results`)

Defined in `.claude/SCHEMA_CONTRACT.md`. Key table:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| scan_date | date | Report date |
| opportunities | jsonb | Array<Opportunity> |
| summary | text | Summary text |
| created_at | timestamptz | Creation timestamp |

RLS: public authenticated read, service role write only.

## SEO Rules

- Every new page must have `generateMetadata`
- Report pages must include JSON-LD Article schema
- `app/sitemap.ts` generates dynamically from Supabase — update when new tables are added
- `app/robots.ts` blocks `/api/`

## Git

- Branch prefix: `feature/`, `fix/`, `chore/`
- Commit format: `feat:`, `fix:`, `chore:` (conventional commits)
- Run `npm run build` before opening a PR

## Agents

Specialized sub-agents live in `.claude/agents/`. Use them for domain-specific work:

| Agent | When to use |
|-------|-------------|
| `@db-designer` | Schema changes, migrations, RLS policies |
| `@frontend-developer` | React components, Next.js pages, shadcn/ui |
| `@bug-finder` | Read-only code review before PRs |
| `@bug-fixer` | Fix issues from BUG_REPORT.md |
| `@seo-auditor` | After adding new pages |
| `@type-checker` | After large changes, TypeScript validation |

Agents coordinate via contract files in `.claude/`:
- `SCHEMA_CONTRACT.md` — DB ↔ Frontend schema contract
- `BUG_REPORT.md` — bug-finder writes, bug-fixer reads
- `SEO_AUDIT.md` — seo-auditor writes, frontend-developer reads
