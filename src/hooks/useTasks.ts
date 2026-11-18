import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Database } from '@/database.types'
import { supabase } from '@/lib/supabase'

export type Task = Database['public']['Tables']['tasks']['Row']
export type MicroTask = Database['public']['Tables']['micro_tasks']['Row']

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [microTasks, setMicroTasks] = useState<MicroTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [t, m] = await Promise.all([
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('micro_tasks').select('*').order('position'),
    ])
    const err = t.error ?? m.error
    setError(err ? err.message : null)
    if (!err) {
      setTasks(t.data ?? [])
      setMicroTasks(m.data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const reload = () => {
    setLoading(true)
    load()
  }

  async function addTask(input: { title: string; course?: string; deadline?: string }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ title: input.title, course: input.course || null, deadline: input.deadline || null })
      .select()
      .single()
    if (error) return void toast.error(error.message)
    setTasks((prev) => [data, ...prev])
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) return void toast.error(error.message)
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setMicroTasks((prev) => prev.filter((m) => m.task_id !== id))
  }

  async function addMicroTask(input: { task_id: string; title: string; planned_date: string }) {
    const position = microTasks.filter((m) => m.task_id === input.task_id).length
    const { data, error } = await supabase
      .from('micro_tasks')
      .insert({ ...input, position })
      .select()
      .single()
    if (error) return void toast.error(error.message)
    setMicroTasks((prev) => [...prev, data])
  }

  async function updateMicroTask(id: string, patch: { title?: string; planned_date?: string; is_done?: boolean }) {
    const { data, error } = await supabase.from('micro_tasks').update(patch).eq('id', id).select().single()
    if (error) return void toast.error(error.message)
    setMicroTasks((prev) => prev.map((m) => (m.id === id ? data : m)))
  }

  async function deleteMicroTask(id: string) {
    const { error } = await supabase.from('micro_tasks').delete().eq('id', id)
    if (error) return void toast.error(error.message)
    setMicroTasks((prev) => prev.filter((m) => m.id !== id))
  }

  return { tasks, microTasks, loading, error, reload, addTask, deleteTask, addMicroTask, updateMicroTask, deleteMicroTask }
}

export type TasksApi = ReturnType<typeof useTasks>
