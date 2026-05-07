'use client'

import { Task, PRIORITY_CONFIG, CATEGORY_CONFIG } from '@/lib/types'
import { formatDate, isOverdue, isDueSoon, truncate, cn } from '@/lib/utils'
import { Calendar, Clock, Tag, MoreHorizontal, CheckCircle2, Circle, Trash2, Edit3 } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  isDragging?: boolean
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit, isDragging }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const priority = PRIORITY_CONFIG[task.priority]
  const category = CATEGORY_CONFIG[task.category]
  const overdue = isOverdue(task.due_date)
  const dueSoon = isDueSoon(task.due_date)
  const isDone = task.status === 'done'

  const toggleDone = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdate(task.id, { status: isDone ? 'todo' : 'done' })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'task-card group relative',
        isDone && 'opacity-50',
        isDragging && 'rotate-1 scale-105 shadow-lg opacity-80',
      )}
      onClick={() => onEdit(task)}
    >
      {/* Priority bar */}
      <div className={cn('absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full', priority.dot)} />

      <div className="pl-3">
        {/* Header row */}
        <div className="flex items-start gap-2 mb-2">
          {/* Completion toggle */}
          <button
            onClick={toggleDone}
            className={cn(
              'flex-shrink-0 mt-0.5 transition-all duration-200',
              isDone ? 'text-sage-400' : 'text-[--text-muted] hover:text-[--text-secondary]'
            )}
          >
            {isDone ? <CheckCircle2 size={15} /> : <Circle size={15} />}
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-sm font-medium text-[--text-primary] leading-snug',
              isDone && 'line-through text-[--text-muted]'
            )}>
              {truncate(task.title, 60)}
            </p>
            {task.description && (
              <p className="text-xs text-[--text-muted] mt-0.5 leading-relaxed">
                {truncate(task.description, 80)}
              </p>
            )}
          </div>

          {/* Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
              className="w-6 h-6 rounded-md flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-white/8 transition-all opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal size={13} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -5 }}
                  className="absolute right-0 top-7 z-50 card p-1 min-w-[140px] shadow-lg"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => { onEdit(task); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-[--text-secondary] hover:text-[--text-primary] hover:bg-white/5"
                  >
                    <Edit3 size={12} /> Edit task
                  </button>
                  <button
                    onClick={() => { onDelete(task.id); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-coral-400 hover:bg-coral-400/10"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category */}
          <span className="text-[10px] text-[--text-muted]">{category.icon}</span>

          {/* Priority badge */}
          <span className={cn('badge text-[10px]', priority.bg, priority.color)}>
            <span className={cn('w-1 h-1 rounded-full', priority.dot)} />
            {priority.label}
          </span>

          {/* Due date */}
          {task.due_date && (
            <span className={cn(
              'flex items-center gap-1 text-[10px]',
              overdue ? 'text-coral-400' : dueSoon ? 'text-amber-400' : 'text-[--text-muted]'
            )}>
              <Calendar size={10} />
              {formatDate(task.due_date)}
            </span>
          )}

          {/* Estimated time */}
          {task.estimated_minutes && (
            <span className="flex items-center gap-1 text-[10px] text-[--text-muted]">
              <Clock size={10} />
              {task.estimated_minutes}m
            </span>
          )}

          {/* Tags */}
          {task.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="flex items-center gap-1 text-[10px] text-[--text-muted]">
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
