export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'other'

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  category: TaskCategory
  tags: string[]
  due_date?: string
  estimated_minutes?: number
  actual_minutes?: number
  completed_at?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface TaskFormData {
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  category: TaskCategory
  tags: string[]
  due_date?: string
  estimated_minutes?: number
}

export interface Analytics {
  total: number
  completed: number
  in_progress: number
  todo: number
  completion_rate: number
  by_priority: Record<Priority, number>
  by_category: Record<TaskCategory, number>
  streak: number
  tasks_today: number
}

export interface PomodoroSession {
  task_id: string
  duration_minutes: number
  completed_at: string
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; dot: string }> = {
  low: { label: 'Low', color: 'text-sage-400', bg: 'bg-sage-400/10', dot: 'bg-sage-400' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400' },
  high: { label: 'High', color: 'text-coral-400', bg: 'bg-coral-400/10', dot: 'bg-coral-400' },
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' },
}

export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; icon: string; color: string }> = {
  work: { label: 'Work', icon: '💼', color: 'text-blue-400' },
  personal: { label: 'Personal', icon: '🌟', color: 'text-purple-400' },
  health: { label: 'Health', icon: '💪', color: 'text-sage-400' },
  learning: { label: 'Learning', icon: '📚', color: 'text-amber-400' },
  other: { label: 'Other', icon: '✨', color: 'text-obsidian-400' },
}

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  todo: { label: 'To Do', color: 'text-obsidian-400', bg: 'bg-obsidian-400/10' },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  done: { label: 'Done', color: 'text-sage-400', bg: 'bg-sage-400/10' },
}
