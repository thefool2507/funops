'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import TaskModal from '@/components/tasks/TaskModal'
import { Task, TaskFormData, TaskStatus, Priority, TaskCategory, PRIORITY_CONFIG, CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Filter, Search, SortAsc, CheckCircle2, Circle, Trash2, Edit3 } from 'lucide-react'
import { formatDate, isOverdue, isDueSoon, cn } from '@/lib/utils'

export default function TasksPage() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all')
  const [sortBy, setSortBy] = useState<'created' | 'due' | 'priority'>('created')

  const filtered = tasks
    .filter(t => {
      if (filterStatus !== 'all' && t.status !== filterStatus) return false
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'due') return (a.due_date || 'z') < (b.due_date || 'z') ? -1 : 1
      if (sortBy === 'priority') {
        const order = { critical: 0, high: 1, medium: 2, low: 3 }
        return order[a.priority] - order[b.priority]
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const handleSubmit = async (data: TaskFormData) => {
    if (editingTask) await updateTask(editingTask.id, data)
    else await createTask(data)
  }

  if (loading) {
    return <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-700 text-[--text-primary]">All Tasks</h1>
          <p className="text-sm text-[--text-secondary] mt-0.5">{filtered.length} of {tasks.length} tasks</p>
        </div>
        <button onClick={() => { setEditingTask(null); setModalOpen(true) }} className="btn-primary">
          <Plus size={14} /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="input pl-8 text-xs h-8 w-48"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-1 p-1 rounded-lg bg-white/5">
          {(['all', 'todo', 'in_progress', 'done'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs transition-all',
                filterStatus === s ? 'bg-white/10 text-[--text-primary]' : 'text-[--text-muted] hover:text-[--text-secondary]'
              )}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex gap-1 p-1 rounded-lg bg-white/5">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs transition-all flex items-center gap-1',
                filterPriority === p ? 'bg-white/10 text-[--text-primary]' : 'text-[--text-muted] hover:text-[--text-secondary]'
              )}
            >
              {p !== 'all' && <span className={cn('w-1.5 h-1.5 rounded-full', PRIORITY_CONFIG[p].dot)} />}
              {p === 'all' ? 'Priority' : PRIORITY_CONFIG[p].label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <button
          onClick={() => setSortBy(s => s === 'created' ? 'due' : s === 'due' ? 'priority' : 'created')}
          className="btn-ghost h-8 gap-1.5 text-xs border border-white/8"
        >
          <SortAsc size={12} />
          {sortBy === 'created' ? 'Newest' : sortBy === 'due' ? 'Due date' : 'Priority'}
        </button>
      </div>

      {/* Task list */}
      <div className="space-y-1.5">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-3xl mb-3">✨</div>
              <p className="text-sm text-[--text-secondary]">No tasks found</p>
              <p className="text-xs text-[--text-muted] mt-1">Try adjusting your filters or create a new task</p>
            </div>
          ) : (
            filtered.map((task, i) => {
              const priority = PRIORITY_CONFIG[task.priority]
              const category = CATEGORY_CONFIG[task.category]
              const overdue = isOverdue(task.due_date)
              const dueSoon = isDueSoon(task.due_date)

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn('card px-4 py-3 flex items-center gap-3 group hover:-translate-y-0.5 transition-all duration-200 cursor-pointer', task.status === 'done' && 'opacity-50')}
                  onClick={() => { setEditingTask(task); setModalOpen(true) }}
                >
                  {/* Complete toggle */}
                  <button
                    onClick={e => { e.stopPropagation(); updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' }) }}
                    className={cn('flex-shrink-0', task.status === 'done' ? 'text-sage-400' : 'text-[--text-muted] hover:text-sage-400')}
                  >
                    {task.status === 'done' ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                  </button>

                  {/* Priority dot */}
                  <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', priority.dot)} />

                  {/* Title */}
                  <span className={cn('flex-1 text-sm text-[--text-primary] min-w-0 truncate', task.status === 'done' && 'line-through text-[--text-muted]')}>
                    {task.title}
                  </span>

                  {/* Category */}
                  <span className="hidden sm:block text-xs text-[--text-muted]">{category.icon}</span>

                  {/* Due */}
                  {task.due_date && (
                    <span className={cn('hidden md:block text-xs', overdue ? 'text-coral-400' : dueSoon ? 'text-amber-400' : 'text-[--text-muted]')}>
                      {formatDate(task.due_date)}
                    </span>
                  )}

                  {/* Status */}
                  <span className={cn('hidden sm:block badge text-[10px]', STATUS_CONFIG[task.status].bg, STATUS_CONFIG[task.status].color)}>
                    {STATUS_CONFIG[task.status].label}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.stopPropagation(); setEditingTask(task); setModalOpen(true) }}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-white/8"
                    >
                      <Edit3 size={11} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); deleteTask(task.id) }}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[--text-muted] hover:text-coral-400 hover:bg-coral-400/10"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null) }}
        onSubmit={handleSubmit}
        onDelete={deleteTask}
        task={editingTask}
      />
    </motion.div>
  )
}
