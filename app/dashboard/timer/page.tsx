'use client'

import PomodoroTimer from '@/components/tasks/PomodoroTimer'
import { useTasks } from '@/hooks/useTasks'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Task } from '@/lib/types'
import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TimerPage() {
  const { tasks, updateTask } = useTasks()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const activeTasks = tasks.filter(t => t.status !== 'done')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-700 text-[--text-primary]">Focus Timer</h1>
        <p className="text-sm text-[--text-secondary] mt-0.5">Pomodoro technique to boost your deep work sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Timer */}
        <div>
          <PomodoroTimer
            taskTitle={selectedTask?.title}
            onSessionComplete={(mins) => {
              if (selectedTask) {
                updateTask(selectedTask.id, {
                  actual_minutes: (selectedTask.actual_minutes || 0) + mins,
                })
              }
            }}
          />
        </div>

        {/* Task selector */}
        <div className="card p-5">
          <h3 className="font-display font-600 text-sm text-[--text-primary] mb-4">
            Select task to focus on
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activeTasks.length === 0 ? (
              <p className="text-xs text-[--text-muted] text-center py-8">No active tasks. Create one first!</p>
            ) : (
              activeTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm',
                    selectedTask?.id === task.id
                      ? 'bg-amber-400/10 border border-amber-400/20 text-amber-400'
                      : 'hover:bg-white/5 text-[--text-secondary]'
                  )}
                >
                  {selectedTask?.id === task.id
                    ? <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0" />
                    : <Circle size={14} className="flex-shrink-0 opacity-40" />
                  }
                  <span className="flex-1 truncate">{task.title}</span>
                  {task.estimated_minutes && (
                    <span className="text-xs text-[--text-muted] flex-shrink-0">{task.estimated_minutes}m</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
