'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import TaskModal from '@/components/tasks/TaskModal'
import { useTasks } from '@/hooks/useTasks'
import { Task, TaskFormData, TaskStatus } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { tasks, createTask, updateTask, deleteTask, getAnalytics } = useTasks()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser({
        name: data.user.user_metadata?.full_name || data.user.email,
        email: data.user.email,
      })
    })

    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setEditingTask(null)
        setModalOpen(true)
      }
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [router])

  const analytics = getAnalytics()

  const openNewTask = (status?: TaskStatus) => {
    setEditingTask(null)
    setDefaultStatus(status || 'todo')
    setModalOpen(true)
  }

  const handleSubmit = async (data: TaskFormData) => {
    if (editingTask) await updateTask(editingTask.id, data)
    else await createTask(data)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar
          onQuickAdd={() => openNewTask()}
          stats={{ todo: analytics.todo, in_progress: analytics.in_progress, completed: analytics.completed, total: analytics.total }}
        />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
          >
            <Sidebar
              onQuickAdd={() => { openNewTask(); setSidebarOpen(false) }}
              stats={{ todo: analytics.todo, in_progress: analytics.in_progress, completed: analytics.completed, total: analytics.total }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[--bg-base]/90 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-white/5"
          >
            <Menu size={16} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center">
              <span className="text-[10px] font-bold text-obsidian-950">F</span>
            </div>
            <span className="font-display font-700 text-sm text-[--text-primary]">FunOps</span>
          </div>
        </div>

        <div className="hidden lg:block">
          <Header userName={user?.name} />
        </div>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null) }}
        onSubmit={handleSubmit}
        onDelete={deleteTask}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  )
}
