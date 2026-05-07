'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, CheckSquare, BarChart3, Settings,
  Timer, Calendar, LogOut, Plus, Zap
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onQuickAdd: () => void
  stats: { todo: number; in_progress: number; completed: number; total: number }
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/kanban', icon: CheckSquare, label: 'Kanban Board' },
  { href: '/dashboard/tasks', icon: Zap, label: 'All Tasks' },
  { href: '/dashboard/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/timer', icon: Timer, label: 'Focus Timer' },
]

export default function Sidebar({ onQuickAdd, stats }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/')
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-60 flex-shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/5 bg-[--bg-elevated]"
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center shadow-glow-amber">
            <span className="text-xs font-bold text-obsidian-950">F</span>
          </div>
          <span className="font-display font-700 text-base tracking-tight text-[--text-primary]">FunOps</span>
        </div>
      </div>

      {/* Quick Add */}
      <div className="px-3 py-3">
        <button
          onClick={onQuickAdd}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm font-medium hover:bg-amber-400/15 transition-all duration-200 group"
        >
          <Plus size={14} className="group-hover:rotate-90 transition-transform duration-200" />
          New Task
          <span className="ml-auto kbd text-[10px]">⌘K</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        <div className="text-[10px] font-medium text-[--text-muted] px-3 mb-2 uppercase tracking-wider">Workspace</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn('nav-item', isActive && 'active')}>
                <item.icon size={15} className={isActive ? 'text-amber-400' : ''} />
                <span>{item.label}</span>
                {item.href === '/dashboard/kanban' && stats.in_progress > 0 && (
                  <span className="ml-auto badge bg-amber-400/10 text-amber-400">{stats.in_progress}</span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Progress */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="card p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[--text-secondary]">Today&apos;s progress</span>
            <span className="text-xs font-medium text-amber-400">{completionRate}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-[--text-muted]">{stats.completed} done</span>
            <span className="text-[10px] text-[--text-muted]">{stats.total} total</span>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-white/5 space-y-0.5">
        <Link href="/dashboard/settings">
          <div className="nav-item">
            <Settings size={15} />
            Settings
          </div>
        </Link>
        <button onClick={handleLogout} className="nav-item w-full text-left text-coral-400/70 hover:text-coral-400 hover:bg-coral-400/5">
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </motion.aside>
  )
}
