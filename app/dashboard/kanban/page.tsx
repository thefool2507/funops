'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import TaskModal from '@/components/tasks/TaskModal'
import { Task, TaskFormData, TaskStatus } from '@/lib/types'
import { motion } from 'framer-motion'
import { Filter, Search } from 'lucide-react'

export default function KanbanPage() {
  const { tasks, loading, createTask, updateTask, deleteTask, reorderTasks } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo')
  const [search, setSearch] = useState('')

  const filteredTasks = search
    ? tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()))
    : tasks

  const handleSubmit = async (data: TaskFormData) => {
    if (editingTask) await updateTask(editingTask.id, data)
    else await createTask({ ...data, status: defaultStatus })
  }

  const openNew = (status?: TaskStatus) => {
    setEditingTask(null)
    setDefaultStatus(status || 'todo')
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton w-72 h-64 rounded-xl flex-shrink-0" />
        ))}
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-700 text-[--text-primary]">Kanban Board</h1>
          <p className="text-sm text-[--text-secondary] mt-0.5">Drag tasks across columns to change their status</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter tasks..."
              className="input pl-8 text-xs h-8 w-44"
            />
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-auto">
        <KanbanBoard
          tasks={filteredTasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onEdit={openEdit}
          onAddTask={openNew}
          onReorder={reorderTasks}
        />
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null) }}
        onSubmit={handleSubmit}
        onDelete={deleteTask}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </motion.div>
  )
}
