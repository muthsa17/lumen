import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { TasksApi } from '@/hooks/useTasks'

export function TaskForm({ onAdd }: { onAdd: TasksApi['addTask'] }) {
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [deadline, setDeadline] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const clean = title.trim()
    if (!clean) return
    setBusy(true)
    await onAdd({ title: clean, course: course.trim(), deadline })
    setBusy(false)
    setTitle('')
    setCourse('')
    setDeadline('')
  }

  return (
    <form onSubmit={submit} className="@container rounded-xl border bg-card p-4 sm:p-5" aria-labelledby="task-form-title">
      <h3 id="task-form-title" className="text-h3 font-semibold">
        Tugas besar baru
      </h3>
      <div className="mt-3 grid gap-3 @md:grid-cols-2 @3xl:grid-cols-[2fr_1fr_auto_auto] @3xl:items-end">
        <div className="space-y-1.5 @md:col-span-2 @3xl:col-span-1">
          <label htmlFor="task-title" className="text-body-2 font-semibold">
            Judul tugas
          </label>
          <Input id="task-title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Makalah PKN" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="task-course" className="text-body-2 font-semibold">
            Mata kuliah <span className="font-normal text-muted-foreground">(opsional)</span>
          </label>
          <Input id="task-course" value={course} onChange={(e) => setCourse(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="task-deadline" className="text-body-2 font-semibold">
            Tenggat <span className="font-normal text-muted-foreground">(opsional)</span>
          </label>
          <Input id="task-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy || !title.trim()} className="@md:col-span-2 @3xl:col-span-1">
          {busy ? 'Menyimpan…' : 'Tambah tugas'}
        </Button>
      </div>
    </form>
  )
}
