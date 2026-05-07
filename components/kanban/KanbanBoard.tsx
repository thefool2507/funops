'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Task, TaskStatus, STATUS_CONFIG } from '@/lib/types'
import TaskCard from './TaskCard'
import { Plus, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const COLUMNS: { status: TaskStatus; icon: string }[] = [
  { status: 'todo', icon: '○' },
  { status: 'in_progress', icon: '◐' },
  { status: 'done', icon: '●' },
]

interface KanbanBoardProps {
  tasks: Task[]
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  onAddTask: (status?: TaskStatus) => void
  onReorder: (tasks: Task[]) => void
}

export default function KanbanBoard({ tasks, onUpdate, onDelete, onEdit, onAddTask, onReorder }: KanbanBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const getColumnTasks = (status: TaskStatus) =>
    tasks.filter(t => t.status === status)

  const handleDragEnd = (result: DropResult) => {
    setDraggingId(null)
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const newStatus = destination.droppableId as TaskStatus
    const task = tasks.find(t => t.id === draggableId)
    if (!task) return

    if (source.droppableId !== destination.droppableId) {
      onUpdate(draggableId, { status: newStatus })
    } else {
      // Reorder within same column
      const colTasks = [...getColumnTasks(newStatus)]
      const [moved] = colTasks.splice(source.index, 1)
      colTasks.splice(destination.index, 0, moved)
      const otherTasks = tasks.filter(t => t.status !== newStatus)
      onReorder([...otherTasks, ...colTasks.map((t, i) => ({ ...t, order_index: i }))])
    }
  }

  return (
    <DragDropContext
      onDragStart={(start) => setDraggingId(start.draggableId)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {COLUMNS.map(({ status, icon }, colIdx) => {
          const config = STATUS_CONFIG[status]
          const colTasks = getColumnTasks(status)
          
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIdx * 0.1 }}
              className="kanban-col"
            >
              {/* Column header */}
              <div className="kanban-header">
                <div className="flex items-center gap-2">
                  <span className={cn('text-sm', config.color)}>{icon}</span>
                  <span className="font-display font-600 text-sm text-[--text-primary]">{config.label}</span>
                  <span className={cn('badge text-[10px] font-mono', config.bg, config.color)}>
                    {colTasks.length}
                  </span>
                </div>
                <button className="w-6 h-6 rounded-md flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-white/5 transition-all">
                  <MoreHorizontal size={13} />
                </button>
              </div>

              {/* Droppable area */}
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'flex flex-col gap-2.5 min-h-[200px] rounded-xl p-2 transition-all duration-200',
                      snapshot.isDraggingOver && 'bg-white/3 ring-1 ring-white/8'
                    )}
                  >
                    {colTasks.map((task, idx) => (
                      <Draggable key={task.id} draggableId={task.id} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onUpdate={onUpdate}
                              onDelete={onDelete}
                              onEdit={onEdit}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Empty state */}
                    {colTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="text-2xl mb-2 opacity-30">{icon}</div>
                        <p className="text-xs text-[--text-muted]">No tasks here</p>
                        <p className="text-[10px] text-[--text-muted]/60 mt-0.5">Drag tasks or add new</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>

              {/* Add task button */}
              <button
                onClick={() => onAddTask(status)}
                className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-xs text-[--text-muted] hover:text-[--text-secondary] hover:bg-white/5 transition-all duration-200 border border-dashed border-white/8 hover:border-white/15"
              >
                <Plus size={12} /> Add task
              </button>
            </motion.div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
