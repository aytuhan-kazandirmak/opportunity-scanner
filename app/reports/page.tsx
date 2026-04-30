import type { Metadata } from 'next'
import { listReports } from '@/lib/data'
import { ReportsListClient } from '@/components/reports-list-client'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Scan Reports | Opportunity Scanner',
  description: 'Browse all AI and software opportunity scan reports. Daily analysis of market gaps, fresh GitHub projects, and solo-buildable SaaS ideas.',
  openGraph: {
    title: 'Scan Reports | Opportunity Scanner',
    description: 'Browse all AI and software opportunity scan reports. Daily analysis of market gaps, fresh GitHub projects, and solo-buildable SaaS ideas.',
    type: 'website',
  },
}

export default async function ReportsPage() {
  const reports = await listReports()
  return <ReportsListClient reports={reports} />
}
