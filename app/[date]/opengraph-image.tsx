import { readFileSync } from 'fs'
import path from 'path'
import { ImageResponse } from 'next/og'
import { getReport } from '@/lib/data'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 86400

const CELLS = [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1]

function getISOWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const thursday = new Date(date)
  thursday.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  const firstThursday = new Date(thursday.getFullYear(), 0, 4)
  return (
    1 +
    Math.round(
      ((thursday.getTime() - firstThursday.getTime()) / 86400000 -
        3 +
        ((firstThursday.getDay() + 6) % 7)) /
        7,
    )
  )
}

export default async function Image({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = await params

  const [fontData, report] = await Promise.all([
    Promise.resolve(
      readFileSync(path.join(process.cwd(), 'public', 'fonts', 'JetBrainsMono-Bold.ttf')),
    ),
    getReport(date).catch(() => null),
  ])

  const week = getISOWeek(date)
  const year = date.split('-')[0]
  const oppCount = Array.isArray(report?.opportunities) ? report.opportunities.length : 0
  const rawSummary = report?.summary_en ?? report?.summary ?? null
  const summaryText = rawSummary
    ? rawSummary.length > 120
      ? rawSummary.slice(0, 117) + '…'
      : rawSummary
    : `${oppCount} opportunities identified this week.`

  const fontFamily = '"JetBrains Mono", monospace'
  const fonts = [{ name: 'JetBrains Mono', data: fontData, style: 'normal' as const, weight: 700 as const }]

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#f3eee3',
          fontFamily,
          padding: '64px 80px',
        }}
      >
        {/* Top: small logo lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '44px',
              height: '44px',
              gap: '3px',
            }}
          >
            {CELLS.map((on, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: on ? '#1a1814' : 'transparent',
                  borderRadius: '1px',
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#1a1814',
            }}
          >
            AIMARKETLENS
          </span>
        </div>

        {/* Middle: headline block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Week badge */}
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              backgroundColor: '#ff6b35',
              color: '#fbf8f1',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              padding: '6px 16px',
              borderRadius: '999px',
            }}
          >
            {year} · WEEK {week}
          </div>

          <h1
            style={{
              fontSize: '60px',
              fontWeight: 700,
              color: '#1a1814',
              lineHeight: 1.05,
              margin: '0',
            }}
          >
            Opportunity Scan
          </h1>

          <p
            style={{
              fontSize: '20px',
              color: '#4a4438',
              lineHeight: 1.5,
              margin: '0',
              maxWidth: '880px',
            }}
          >
            {summaryText}
          </p>
        </div>

        {/* Bottom: stats + domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{ fontSize: '36px', fontWeight: 700, color: '#ff6b35', lineHeight: 1 }}
            >
              {oppCount}
            </span>
            <span
              style={{ fontSize: '12px', color: '#7a7261', letterSpacing: '0.08em' }}
            >
              OPPORTUNITIES
            </span>
          </div>

          <span
            style={{ fontSize: '13px', color: '#7a7261', letterSpacing: '0.1em' }}
          >
            aimarketlens.ai
          </span>
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
