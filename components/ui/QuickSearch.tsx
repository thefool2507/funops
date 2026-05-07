'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Plus, LayoutDashboard, CheckSquare, BarChart3, Timer, Calendar, ArrowRight, Hash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Task, PRIORITY_CONFIG } from '@/lib/types'
import { cn } from '@/lib/utils'

interface QuickSearchProps {
  open: boolean
  onClose: () => void
  tasks: Task[]
  onNewTask: () => void
  onEditTask: (task: Task) => void
}

const NAV_ACTIONS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Kanban Board', icon: CheckSquare, href: '/dashboard/kanban' },
  { label: 'All Tasks', icon: Hash, href: '/dashboard/tasks' },
  { label: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
  { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
  { label: 'Focus Timer', icon: Timer, href: '/dashboard/timer' },
]

export default function QuickSearch({ open, onClose, tasks, onNewTask, onEditTask }: QuickSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const filteredTasks = query.length > 1
    ? tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : []

  const filteredNav = NAV_ACTIONS.filter(n =>
    !query || n.label.toLowerCase().includes(query.toLowerCase())
  )

  const allItems = [
    ...filteredNav.map(n => ({ type: 'nav' as const, ...n, id: n.href })),
    ...filteredTasks.map(t => ({ type: 'task' as const, id: t.id, label: t.title, task: t })),
  ]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor(c => Math.min(c + 1, allItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor(c => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = allItems[cursor]
      if (!item) return
      if (item.type === 'nav') {
        router.push(item.href!)
        onClose()
      } else if (item.type === 'task') {
        onEditTask(item.task!)
        onClose()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <div className="card shadow-modal overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <Search size={15} className="text-[--text-muted] flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setCursor(0) }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search tasks or navigate..."
                  className="flex-1 bg-transparent text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none"
                />
                <kbd className="kbd">esc</kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {/* Quick action: New task */}
                {query.length > 0 && (
                  <button
                    onClick={() => { onNewTask(); onClose() }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      cursor === -1 ? 'bg-amber-400/10 text-amber-400' : 'text-[--text-secondary] hover:bg-white/5'
                    )}
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center">
                      <Plus size={13} className="text-amber-400" />
                    </div>
                    <span>Create &ldquo;<strong>{query}</strong>&rdquo; as new task</span>
                    <ArrowRight size={13} className="ml-auto" />
                  </button>
                )}

                {/* Navigation items */}
                {filteredNav.length > 0 && (
                  <>
                    <div className="px-4 py-1.5 text-[10px] font-medium text-[--text-muted] uppercase tracking-wider">
                      Navigation
                    </div>
                    {filteredNav.map((item, i) => {
                      const idx = filteredTasks.length === 0 ? i : i
                      const isActive = allItems[cursor]?.id === item.href
                      return (
                        <button
                          key={item.href}
                          onClick={() => { router.push(item.href); onClose() }}
                          onMouseEnter={() => setCursor(allItems.findIndex(a => a.id === item.href))}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                            isActive ? 'bg-white/6 text-[--text-primary]' : 'text-[--text-secondary] hover:bg-white/4'
                          )}
                        >
                          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                            <item.icon size={13} />
                          </div>
                          {item.label}
                          <ArrowRight size={12} className="ml-auto opacity-40" />
                        </button>
                      )
                    })}
                  </>
                )}

                {/* Task results */}
                {filteredTasks.length > 0 && (
                  <>
                    <div className="px-4 py-1.5 mt-1 text-[10px] font-medium text-[--text-muted] uppercase tracking-wider">
                      Tasks
                    </div>
                    {filteredTasks.map((task) => {
                      const p = PRIORITY_CONFIG[task.priority]
                      const isActive = allItems[cursor]?.id === task.id
                      return (
                        <button
                          key={task.id}
                          onClick={() => { onEditTask(task); onClose() }}
                          onMouseEnter={() => setCursor(allItems.findIndex(a => a.id === task.id))}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                            isActive ? 'bg-white/6 text-[--text-primary]' : 'text-[--text-secondary] hover:bg-white/4'
                          )}
                        >
                          <span className={cn('w-2 h-2 rounded-full flex-shrink-0', p.dot)} />
                          <span className="flex-1 text-left truncate">{task.title}</span>
                          <span className={cn('text-[10px] badge', p.bg, p.color)}>{p.label}</span>
                        </button>
                      )
                    })}
                  </>
                )}

                {allItems.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-[--text-muted]">No results for &ldquo;{query}&rdquo;</p>
                  </div>
                )}
              </div>

              {/* Footer hints */}
              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/5">
                <span className="text-[10px] text-[--text-muted] flex items-center gap-1.5">
                  <kbd className="kbd">↑↓</kbd> navigate
                </span>
                <span className="text-[10px] text-[--text-muted] flex items-center gap-1.5">
                  <kbd className="kbd">↵</kbd> select
                </span>
                <span className="text-[10px] text-[--text-muted] flex items-center gap-1.5">
                  <kbd className="kbd">esc</kbd> close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
