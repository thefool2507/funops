'use client'

import { motion } from 'framer-motion'
import { useTasks } from '@/hooks/useTasks'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'
import TaskModal from '@/components/tasks/TaskModal'
import { useState } from 'react'
import { Task, TaskFormData, TaskStatus } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Calendar, CheckCircle2, Clock, AlertTriangle, Zap, LayoutGrid } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { tasks, loading, createTask, updateTask, deleteTask, reorderTasks, getAnalytics, getTasksByStatus } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo')
  const analytics = getAnalytics()

  const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done')
  const todayTasks = tasks.filter(t => t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString())
  const recentTasks = tasks.slice(-5).reverse()

  const handleSubmit = async (data: TaskFormData) => {
    if (editingTask) await updateTask(editingTask.id, data)
    else await createTask(data)
  }

  const openEdit = (task: Task) => { setEditingTask(task); setModalOpen(true) }
  const openNew = (status?: TaskStatus) => { setEditingTask(null); setDefaultStatus(status || 'todo'); setModalOpen(true) }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="skeleton h-64 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-700 text-[--text-primary]">Dashboard</h1>
        <p className="text-sm text-[--text-secondary] mt-1">{formatDate(new Date())} · Here&apos;s your operations overview</p>
      </motion.div>

      {/* Stats */}
      <AnalyticsDashboard analytics={analytics} />

      {/* Alerts */}
      {overdueTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-coral-400/8 border border-coral-400/15"
        >
          <AlertTriangle size={16} className="text-coral-400 flex-shrink-0" />
          <div>
            <span className="text-sm text-coral-400 font-medium">{overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''}</span>
            <span className="text-xs text-coral-400/70 ml-2">Need your attention</span>
          </div>
          <button onClick={() => openEdit(overdueTasks[0])} className="ml-auto text-xs text-coral-400 hover:text-coral-300 underline">
            Review
          </button>
        </motion.div>
      )}

      {/* Quick board view */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-600 text-[--text-primary] flex items-center gap-2">
            <LayoutGrid size={16} className="text-amber-400" />
            Kanban Board
          </h2>
          <Link href="/dashboard/kanban" className="text-xs text-[--text-secondary] hover:text-amber-400 transition-colors">
            Full view →
          </Link>
        </div>
        <KanbanBoard
          tasks={tasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onEdit={openEdit}
          onAddTask={openNew}
          onReorder={reorderTasks}
        />
      </div>

      {/* Today's tasks */}
      {todayTasks.length > 0 && (
        <div>
          <h2 className="font-display font-600 text-[--text-primary] flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-amber-400" />
            Due Today
            <span className="badge bg-amber-400/10 text-amber-400 text-[10px]">{todayTasks.length}</span>
          </h2>
          <div className="space-y-2">
            {todayTasks.map(task => (
              <div
                key={task.id}
                onClick={() => openEdit(task)}
                className="card px-4 py-3 flex items-center gap-3 cursor-pointer group hover:-translate-y-0.5 transition-all"
              >
                <button
                  onClick={e => { e.stopPropagation(); updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' }) }}
                  className={task.status === 'done' ? 'text-sage-400' : 'text-[--text-muted] hover:text-sage-400'}
                >
                  <CheckCircle2 size={16} />
                </button>
                <span className={`flex-1 text-sm ${task.status === 'done' ? 'line-through text-[--text-muted]' : 'text-[--text-primary]'}`}>
                  {task.title}
                </span>
                {task.estimated_minutes && (
                  <span className="text-xs text-[--text-muted] flex items-center gap-1">
                    <Clock size={11} />{task.estimated_minutes}m
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
