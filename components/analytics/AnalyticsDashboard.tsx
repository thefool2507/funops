'use client'

import { Analytics as AnalyticsType, PRIORITY_CONFIG, CATEGORY_CONFIG } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Zap, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalyticsDashboardProps {
  analytics: AnalyticsType
}

const COLORS = ['#4ade80', '#fbbf24', '#fb7185', '#ef4444']

export default function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  const priorityData = Object.entries(analytics.by_priority).map(([key, value]) => ({
    name: PRIORITY_CONFIG[key as keyof typeof PRIORITY_CONFIG].label,
    value,
    color: PRIORITY_CONFIG[key as keyof typeof PRIORITY_CONFIG].dot,
  }))

  const categoryData = Object.entries(analytics.by_category).map(([key, value]) => ({
    name: CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG].icon + ' ' + CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG].label,
    value,
  }))

  const stats = [
    {
      label: 'Total Tasks',
      value: analytics.total,
      icon: Target,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      sub: `${analytics.tasks_today} added today`,
    },
    {
      label: 'Completed',
      value: analytics.completed,
      icon: TrendingUp,
      color: 'text-sage-400',
      bg: 'bg-sage-400/10',
      sub: `${analytics.completion_rate}% rate`,
    },
    {
      label: 'In Progress',
      value: analytics.in_progress,
      icon: Zap,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      sub: 'Active right now',
    },
    {
      label: 'To Do',
      value: analytics.todo,
      icon: Clock,
      color: 'text-coral-400',
      bg: 'bg-coral-400/10',
      sub: 'Pending tasks',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card"
          >
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', s.bg)}>
              <s.icon size={16} className={s.color} />
            </div>
            <div>
              <div className={cn('font-display font-700 text-2xl', s.color)}>{s.value}</div>
              <div className="text-xs text-[--text-secondary]">{s.label}</div>
              <div className="text-[10px] text-[--text-muted] mt-0.5">{s.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion rate progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-600 text-sm text-[--text-primary]">Overall Completion</h3>
          <span className="font-mono text-sm text-amber-400">{analytics.completion_rate}%</span>
        </div>
        <div className="progress-bar h-2">
          <motion.div
            className="progress-fill h-full"
            initial={{ width: 0 }}
            animate={{ width: `${analytics.completion_rate}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-[--text-muted]">{analytics.completed} completed</span>
          <span className="text-xs text-[--text-muted]">{analytics.total} total</span>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By Category bar chart */}
        <div className="card p-5">
          <h3 className="font-display font-600 text-sm text-[--text-primary] mb-5">Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={categoryData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#1e1b17',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  color: '#f0ece4',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="value" fill="#fbbf24" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Priority pie chart */}
        <div className="card p-5">
          <h3 className="font-display font-600 text-sm text-[--text-primary] mb-5">Tasks by Priority</h3>
          {analytics.total === 0 ? (
            <div className="h-[180px] flex items-center justify-center">
              <p className="text-xs text-[--text-muted]">No tasks yet</p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {priorityData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} opacity={0.85} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2.5">
                {priorityData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                    <span className="text-[--text-secondary]">{d.name}</span>
                    <span className="font-mono text-[--text-muted] ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
