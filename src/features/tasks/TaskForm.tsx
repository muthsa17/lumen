import { useState, type FormEvent } from 'react'
import { Plus, Calendar, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { TasksApi } from '@/hooks/useTasks'

export function TaskForm({ onAdd }: { onAdd: TasksApi['addTask'] }) {
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [deadline, setDeadline] = useState('')
  const [busy, setBusy] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

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
    setShowDetails(false)
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-2"
      aria-label="Form tambah tugas baru"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute left-4 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-neutral">
            <Plus className="size-5" />
          </div>
          <Input
            id="task-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Apa yang ingin kamu kerjakan?"
            className="h-[52px] rounded-[12px] border-border bg-card pl-12 pr-4 font-sans text-body-1 text-neutral-darker placeholder:text-neutral/70 focus-visible:border-green"
          />
        </div>
        <Button
          type="submit"
          disabled={busy || !title.trim()}
          size="lg"
          className="h-[52px] rounded-[12px] bg-primary px-6 font-heading text-body-1 font-medium text-white shadow-xs hover:bg-green-hover"
        >
          {busy ? 'Menyimpan…' : '+ Tambah Tugas Besar'}
        </Button>
      </div>

      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1.5 text-body-3 font-medium text-neutral transition-colors hover:text-neutral-darker"
        >
          {showDetails ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          <span>{showDetails ? 'Sembunyikan detail mata kuliah & tenggat' : '+ Mata kuliah & tenggat (opsional)'}</span>
        </button>
      </div>

      {showDetails && (
        <div className="mt-2 grid gap-3 rounded-[16px] border border-border bg-card p-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="task-course" className="flex items-center gap-1 text-body-3 font-semibold text-neutral-darker">
              <BookOpen className="size-3.5 text-neutral" />
              Mata kuliah <span className="font-normal text-muted-foreground">(opsional)</span>
            </label>
            <Input
              id="task-course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Contoh: Metodologi Penelitian"
              className="h-10 text-body-2"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="task-deadline" className="flex items-center gap-1 text-body-3 font-semibold text-neutral-darker">
              <Calendar className="size-3.5 text-neutral" />
              Tenggat <span className="font-normal text-muted-foreground">(opsional)</span>
            </label>
            <Input
              id="task-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="h-10 text-body-2"
            />
          </div>
        </div>
      )}
    </form>
  )
}
