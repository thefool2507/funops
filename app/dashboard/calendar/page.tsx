'use client'

import { useState, useMemo } from 'react'
import { useTasks } from '@/hooks/useTasks'
import TaskModal from '@/components/tasks/TaskModal'
import { Task, TaskFormData, PRIORITY_CONFIG } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalIcon,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  addMonths,
  subMonths,
} from 'date-fns'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarPage() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentDate])

  const getTasksForDay = (day: Date) =>
    tasks.filter(
      (t) => t.due_date && isSameDay(parseISO(t.due_date), day)
    )

  const selectedDayTasks = selectedDay ? getTasksForDay(selectedDay) : []

  const handleSubmit = async (data: TaskFormData) => {
    const payload = {
      ...data,
      due_date: selectedDay
        ? format(selectedDay, 'yyyy-MM-dd')
        : data.due_date,
    }
    if (editingTask) await updateTask(editingTask.id, payload)
    else await createTask(payload)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12 rounded-xl w-64" />
        <div className="skeleton h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 text-[--text-primary]">Calendar</h1>
          <p className="text-sm text-[--text-secondary] mt-0.5">View and plan tasks by date</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null)
            setModalOpen(true)
          }}
          className="btn-primary"
        >
          <Plus size={14} /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 card p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-700 text-lg text-[--text-primary]">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-white/5 transition-all"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 h-8 rounded-lg text-xs text-[--text-muted] hover:text-[--text-primary] hover:bg-white/5 transition-all"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-white/5 transition-all"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-[--text-muted] py-1 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayTasks = getTasksForDay(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isSelected = selectedDay && isSameDay(day, selectedDay)
              const isCurrentDay = isToday(day)

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'relative min-h-[56px] p-1.5 rounded-xl text-left transition-all duration-150',
                    isCurrentMonth ? 'hover:bg-white/5' : 'opacity-30',
                    isSelected && 'bg-amber-400/10 ring-1 ring-amber-400/30',
                    isCurrentDay && !isSelected && 'bg-white/5'
                  )}
                >
                  <span className={cn(
                    'inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-medium',
                    isCurrentDay
                      ? 'bg-amber-400 text-obsidian-950 font-700'
                      : isSelected
                        ? 'text-amber-400'
                        : 'text-[--text-secondary]'
                  )}>
                    {format(day, 'd')}
                  </span>

                  {/* Task dots */}
                  {dayTasks.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {dayTasks.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            PRIORITY_CONFIG[t.priority].dot
                          )}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="text-[9px] text-[--text-muted] leading-none mt-px">+{dayTasks.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Day detail panel */}
        <div className="card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-600 text-[--text-primary]">
                {selectedDay ? format(selectedDay, 'EEEE') : 'Select a day'}
              </h3>
              {selectedDay && (
                <p className="text-xs text-[--text-muted]">
                  {format(selectedDay, 'MMMM d, yyyy')}
                </p>
              )}
            </div>
            {selectedDay && (
              <button
                onClick={() => {
                  setEditingTask(null)
                  setModalOpen(true)
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 transition-all"
              >
                <Plus size={13} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedDayTasks.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CalIcon size={32} className="text-[--text-muted] mb-3 opacity-30" />
                  <p className="text-sm text-[--text-muted]">No tasks</p>
                  <p className="text-xs text-[--text-muted]/60 mt-0.5">
                    Click + to add a task for this day
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {selectedDayTasks.map((task, i) => {
                    const p = PRIORITY_CONFIG[task.priority]
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => openEdit(task)}
                        className={cn(
                          'flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer',
                          'bg-white/4 hover:bg-white/7 border border-white/6 hover:border-white/10',
                          'transition-all duration-150 group',
                          task.status === 'done' && 'opacity-50'
                        )}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5', p.dot)} />
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-xs font-medium text-[--text-primary] truncate',
                            task.status === 'done' && 'line-through text-[--text-muted]'
                          )}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn('text-[10px]', p.color)}>{p.label}</span>
                            <span className="text-[10px] text-[--text-muted]">
                              {task.status === 'done' ? '✓ Done' : task.status === 'in_progress' ? '⚡ In progress' : '○ To do'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateTask(task.id, {
                              status: task.status === 'done' ? 'todo' : 'done',
                            })
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[10px] text-[--text-muted] hover:text-sage-400 transition-all px-1.5 py-0.5 rounded bg-white/5"
                        >
                          {task.status === 'done' ? 'Undo' : 'Done'}
                        </button>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Day summary */}
          {selectedDayTasks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-[--text-muted]">
                {selectedDayTasks.filter((t) => t.status === 'done').length}/{selectedDayTasks.length} completed
              </span>
              <div className="w-24 progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.round(
                      (selectedDayTasks.filter((t) => t.status === 'done').length /
                        selectedDayTasks.length) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleSubmit}
        onDelete={deleteTask}
        task={editingTask}
        defaultStatus="todo"
      />
    </motion.div>
  )
}
