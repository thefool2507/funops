'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Tag, Plus, Trash2 } from 'lucide-react'
import { Task, TaskFormData, Priority, TaskStatus, TaskCategory, PRIORITY_CONFIG, CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => void
  onDelete?: (id: string) => void
  task?: Task | null
  defaultStatus?: TaskStatus
}

const defaultForm: TaskFormData = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  category: 'work',
  tags: [],
  due_date: '',
  estimated_minutes: undefined,
}

export default function TaskModal({ open, onClose, onSubmit, onDelete, task, defaultStatus }: TaskModalProps) {
  const [form, setForm] = useState<TaskFormData>(defaultForm)
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        category: task.category,
        tags: task.tags || [],
        due_date: task.due_date || '',
        estimated_minutes: task.estimated_minutes,
      })
    } else {
      setForm({ ...defaultForm, status: defaultStatus || 'todo' })
    }
  }, [task, defaultStatus, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    await onSubmit(form)
    setLoading(false)
    onClose()
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }))
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full max-w-lg card shadow-modal overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <h2 className="font-display font-600 text-[--text-primary]">
                  {task ? 'Edit task' : 'New task'}
                </h2>
                <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-white/5 transition-all">
                  <X size={14} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="What needs to be done?"
                    className="input text-base font-medium"
                    autoFocus
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Add details, notes, or context..."
                    className="input resize-none h-20 text-sm"
                  />
                </div>

                {/* Row: Status + Priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[--text-muted] mb-1.5">Status</label>
                    <div className="flex flex-col gap-1">
                      {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map(s => {
                        const c = STATUS_CONFIG[s]
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, status: s }))}
                            className={cn(
                              'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition-all',
                              form.status === s ? `${c.bg} ${c.color} border border-current/20` : 'text-[--text-muted] hover:bg-white/5'
                            )}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {c.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[--text-muted] mb-1.5">Priority</label>
                    <div className="flex flex-col gap-1">
                      {(Object.keys(PRIORITY_CONFIG) as Priority[]).map(p => {
                        const c = PRIORITY_CONFIG[p]
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, priority: p }))}
                            className={cn(
                              'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition-all',
                              form.priority === p ? `${c.bg} ${c.color} border border-current/20` : 'text-[--text-muted] hover:bg-white/5'
                            )}
                          >
                            <span className={cn('w-1.5 h-1.5 rounded-full', c.dot)} />
                            {c.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs text-[--text-muted] mb-1.5">Category</label>
                  <div className="flex gap-2 flex-wrap">
                    {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map(cat => {
                      const c = CATEGORY_CONFIG[cat]
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, category: cat }))}
                          className={cn(
                            'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all',
                            form.category === cat ? 'bg-white/10 text-[--text-primary] border border-white/15' : 'text-[--text-muted] hover:bg-white/5'
                          )}
                        >
                          {c.icon} {c.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Due date + Time estimate */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[--text-muted] mb-1.5">Due date</label>
                    <input
                      type="date"
                      value={form.due_date || ''}
                      onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                      className="input text-xs py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[--text-muted] mb-1.5">Estimate (min)</label>
                    <input
                      type="number"
                      value={form.estimated_minutes || ''}
                      onChange={e => setForm(f => ({ ...f, estimated_minutes: e.target.value ? parseInt(e.target.value) : undefined }))}
                      placeholder="e.g. 30"
                      className="input text-xs py-2"
                      min={1}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs text-[--text-muted] mb-1.5">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                      placeholder="Add tag & press Enter"
                      className="input flex-1 text-xs py-2"
                    />
                    <button type="button" onClick={addTag} className="btn-ghost border border-white/8 px-2.5 py-2">
                      <Plus size={13} />
                    </button>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mt-2">
                      {form.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 badge bg-white/8 text-[--text-secondary] text-[10px]">
                          <Tag size={9} />{tag}
                          <button type="button" onClick={() => removeTag(tag)} className="hover:text-coral-400 ml-0.5">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  {task && onDelete ? (
                    <button
                      type="button"
                      onClick={() => { onDelete(task.id); onClose() }}
                      className="btn-danger"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  ) : <div />}

                  <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
                      ) : task ? 'Save changes' : 'Create task'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
