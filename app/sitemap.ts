import type { MetadataRoute } from 'next'
import { listReports } from '@/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const reports = await listReports()
  const baseUrl = 'https://opportunity-scanner.vercel.app'

  const reportEntries: MetadataRoute.Sitemap = reports.map((r) => ({
    url: `${baseUrl}/reports/${r.scan_date}`,
    lastModified: new Date(r.scan_date),
    changeFrequency: 'yearly',
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/reports`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...reportEntries,
  ]
}
