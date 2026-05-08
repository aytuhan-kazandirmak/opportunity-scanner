import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

const CELLS = [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1]

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    ).then((r) => r.text())

    const fontUrl = css.match(/src: url\((.+?)\) format\('woff2'\)/)?.[1]
    if (!fontUrl) return null
    return fetch(fontUrl).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

export default async function Image() {
  const fontData = await loadFont()

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3eee3',
          fontFamily: fontData ? '"JetBrains Mono", monospace' : 'monospace',
          position: 'relative',
        }}
      >
        {/* Border frame */}
        <div
          style={{
            position: 'absolute',
            inset: '40px',
            border: '1px solid #c9bfa9',
            borderRadius: '8px',
          }}
        />

        {/* Logo + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* 4×4 pixel grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '5px',
              width: '88px',
              height: '88px',
            }}
          >
            {CELLS.map((on, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: on ? '#1a1814' : 'transparent',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>

          <span
            style={{
              fontSize: '54px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              color: '#1a1814',
            }}
          >
            AIMARKETLENS
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            marginTop: '28px',
            marginBottom: '0px',
            fontSize: '22px',
            color: '#4a4438',
            letterSpacing: '0.04em',
          }}
        >
          Daily AI Opportunity Scanner
        </p>

        {/* Domain */}
        <span
          style={{
            position: 'absolute',
            bottom: '64px',
            fontSize: '14px',
            color: '#7a7261',
            letterSpacing: '0.1em',
          }}
        >
          aimarketlens.ai
        </span>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'JetBrains Mono', data: fontData, style: 'normal', weight: 700 }]
        : [],
    },
  )
}
