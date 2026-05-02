import type { Metadata } from 'next'
import { listReports } from '@/lib/data'
import { ReportsListClient } from '@/components/reports-list-client'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Opportunity Scanner',
  description: 'Daily AI and software market gap analysis. Browse scan reports with fresh GitHub projects and solo-buildable SaaS opportunities.',
}

export default async function ReportsPage() {
  const reports = await listReports()
  return <ReportsListClient reports={reports} />
}
