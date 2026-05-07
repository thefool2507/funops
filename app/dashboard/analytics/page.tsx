'use client'

import { useTasks } from '@/hooks/useTasks'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'
import { motion } from 'framer-motion'

export default function AnalyticsPage() {
  const { loading, getAnalytics } = useTasks()
  const analytics = getAnalytics()

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-700 text-[--text-primary]">Analytics</h1>
        <p className="text-sm text-[--text-secondary] mt-0.5">Visualize your productivity and task patterns</p>
      </div>
      <AnalyticsDashboard analytics={analytics} />
    </motion.div>
  )
}
