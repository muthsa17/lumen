import { Pencil, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import type { MicroTask, Task, TasksApi } from '@/hooks/useTasks'
import { todayLocal } from '@/lib/date'
import { dayLabel } from '@/lib/format'
import { cn } from '@/lib/utils'

type Api = Pick<TasksApi, 'deleteTask' | 'addMicroTask' | 'updateMicroTask' | 'deleteMicroTask'>

export function TaskCard({ task, steps, api }: { task: Task; steps: MicroTask[]; api: Api }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const done = steps.filter((s) => s.is_done).length
  const percent = steps.length ? Math.round((done / steps.length) * 100) : 0

  return (
    <article className="rounded-xl border bg-card p-4 sm:p-5" aria-labelledby={`task-${task.id}`}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 id={`task-${task.id}`} className="text-card-title font-semibold break-words">
            {task.title}
          </h3>
          {(task.course || task.deadline) && (
            <p className="mt-1 text-body text-muted-foreground">
              {[task.course, task.deadline && `Tenggat ${dayLabel(task.deadline)}`].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <Button variant="ghost" size="icon" aria-label={`Hapus tugas ${task.title}`} onClick={() => setConfirmOpen(true)}>
          <Trash2 aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Progress value={percent} aria-label={`Progres ${task.title}`} className="h-2 flex-1" />
        <span className="shrink-0 text-body text-muted-foreground">
          {done}/{steps.length} langkah
        </span>
      </div>

      {steps.length > 0 ? (
        <ul className="mt-3 grid gap-2">
          {steps.map((s) => (
            <StepRow key={s.id} step={s} api={api} />
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-body text-muted-foreground">Belum ada langkah. Mulai dari yang paling kecil, misalnya "cari 3 referensi".</p>
      )}

      <AddStepForm taskId={task.id} onAdd={api.addMicroTask} />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-card-title">Hapus "{task.title}"?</DialogTitle>
            <DialogDescription className="text-body">Semua langkah di dalamnya ikut terhapus dan tidak bisa dikembalikan.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={() => api.deleteTask(task.id)}>
              Hapus tugas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  )
}

export function StepRow({ step, api }: { step: MicroTask; api: Pick<Api, 'updateMicroTask' | 'deleteMicroTask'> }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(step.title)
  const id = `step-${step.id}`

  async function save(e?: FormEvent) {
    e?.preventDefault()
    const clean = draft.trim()
    if (clean && clean !== step.title) await api.updateMicroTask(step.id, { title: clean })
    else setDraft(step.title)
    setEditing(false)
  }

  return (
    <li
      // Figma "Selected" state, shown while any control in the row has focus.
      className={cn(
        'flex min-h-15 items-center gap-3 rounded-lg border bg-card py-2 pr-2 pl-4 transition-colors focus-within:border-emerald focus-within:bg-mint',
        step.is_done && 'bg-muted/60',
      )}
    >
      <Checkbox id={id} checked={step.is_done} onCheckedChange={(v) => api.updateMicroTask(step.id, { is_done: v === true })} />
      {editing ? (
        <form onSubmit={save} className="min-w-0 flex-1">
          <label htmlFor={`${id}-edit`} className="sr-only">
            Ubah langkah
          </label>
          <Input
            id={`${id}-edit`}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => save()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDraft(step.title)
                setEditing(false)
              }
            }}
          />
        </form>
      ) : (
        <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
          <span className={step.is_done ? 'block break-words text-body text-muted-foreground line-through' : 'block break-words text-body text-ink-soft'}>{step.title}</span>
          {/* Narrow screens: badge sits under the title so the title keeps its width. */}
          <Badge variant="muted" className="mt-1 sm:hidden">
            {dayLabel(step.planned_date)}
          </Badge>
        </label>
      )}
      {!editing && (
        <Button variant="ghost" size="icon" aria-label={`Ubah langkah ${step.title}`} onClick={() => setEditing(true)}>
          <Pencil aria-hidden="true" />
        </Button>
      )}
      <Button variant="ghost" size="icon" aria-label={`Hapus langkah ${step.title}`} onClick={() => api.deleteMicroTask(step.id)}>
        <Trash2 aria-hidden="true" />
      </Button>
      <Badge variant="muted" className="max-sm:hidden">
        {dayLabel(step.planned_date)}
      </Badge>
    </li>
  )
}

function AddStepForm({ taskId, onAdd }: { taskId: string; onAdd: TasksApi['addMicroTask'] }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayLocal())
  const titleId = `new-step-${taskId}`
  const dateId = `new-step-date-${taskId}`

  async function submit(e: FormEvent) {
    e.preventDefault()
    const clean = title.trim()
    if (!clean) return
    await onAdd({ task_id: taskId, title: clean, planned_date: date })
    setTitle('')
  }

  return (
    <form onSubmit={submit} className="mt-3 grid grid-cols-[1fr_auto] gap-2">
      <label htmlFor={titleId} className="sr-only">
        Langkah baru
      </label>
      <Input id={titleId} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Langkah kecil berikutnya" className="col-span-2" />
      <label htmlFor={dateId} className="sr-only">
        Rencana dikerjakan
      </label>
      <Input id={dateId} type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
      <Button type="submit" variant="outline" disabled={!title.trim()}>
        Tambah langkah
      </Button>
    </form>
  )
}
