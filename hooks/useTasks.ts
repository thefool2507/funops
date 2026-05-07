'use client'

import { useState, useEffect, useCallback } from 'react'
import { Task, TaskFormData, TaskStatus } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('order_index', { ascending: true })
    if (!error && data) setTasks(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()

    // Realtime subscription
    const supabase = createClient()
    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
      }, () => fetchTasks())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchTasks])

  const createTask = async (form: TaskFormData): Promise<Task | null> => {
    const supabase = createClient()
    const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order_index)) + 1 : 0
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...form, order_index: maxOrder })
      .select()
      .single()
    if (error) { toast.error('Failed to create task'); return null }
    setTasks(prev => [...prev, data])
    toast.success('Task created!')
    return data
  }

  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
    const supabase = createClient()
    
    if (updates.status === 'done') {
      updates.completed_at = new Date().toISOString()
    } else if ('status' in updates) {
      updates.completed_at = undefined
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) { toast.error('Failed to update task'); return }
    setTasks(prev => prev.map(t => t.id === id ? data : t))
  }

  const deleteTask = async (id: string): Promise<void> => {
    const supabase = createClient()
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) { toast.error('Failed to delete task'); return }
    setTasks(prev => prev.filter(t => t.id !== id))
    toast.success('Task deleted')
  }

  const moveTask = async (taskId: string, newStatus: TaskStatus): Promise<void> => {
    await updateTask(taskId, { status: newStatus })
  }

  const reorderTasks = async (reordered: Task[]): Promise<void> => {
    setTasks(reordered)
    const supabase = createClient()
    const updates = reordered.map((t, i) => ({ id: t.id, order_index: i }))
    for (const u of updates) {
      await supabase.from('tasks').update({ order_index: u.order_index }).eq('id', u.id)
    }
  }

  const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status)

  const getAnalytics = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'done').length
    const in_progress = tasks.filter(t => t.status === 'in_progress').length
    const todo = tasks.filter(t => t.status === 'todo').length
    const today = new Date().toDateString()
    const tasks_today = tasks.filter(t => new Date(t.created_at).toDateString() === today).length
    const completion_rate = total > 0 ? Math.round((completed / total) * 100) : 0

    const by_priority = {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
      critical: tasks.filter(t => t.priority === 'critical').length,
    }

    const by_category = {
      work: tasks.filter(t => t.category === 'work').length,
      personal: tasks.filter(t => t.category === 'personal').length,
      health: tasks.filter(t => t.category === 'health').length,
      learning: tasks.filter(t => t.category === 'learning').length,
      other: tasks.filter(t => t.category === 'other').length,
    }

    return { total, completed, in_progress, todo, tasks_today, completion_rate, by_priority, by_category, streak: 0 }
  }

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    getTasksByStatus,
    getAnalytics,
    refetch: fetchTasks,
  }
}
