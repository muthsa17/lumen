import { Pencil, Trash2, Plus, Calendar } from 'lucide-react'
import { useState, type FormEvent } from 'react'
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

export function TaskCard({
  task,
  steps,
  api,
  selectedStepId,
}: {
  task: Task
  steps: MicroTask[]
  api: Api
  selectedStepId?: string
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const done = steps.filter((s) => s.is_done).length
  const percent = steps.length ? Math.round((done / steps.length) * 100) : 0
  const estimatedMin = steps.length * 15

  return (
    <article
      className="rounded-[20px] border border-border bg-white p-6 shadow-xs sm:p-[25px]"
      aria-labelledby={`task-${task.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 id={`task-${task.id}`} className="font-heading text-h2 font-semibold tracking-tight text-neutral-darker break-words">
              {task.title}
            </h3>
            <span className="inline-flex items-center rounded-full border border-green-light-hover bg-green-light px-2.5 py-0.5 font-heading text-body-4 font-medium text-green">
              Aktif
            </span>
          </div>
          {(task.course || task.deadline) && (
            <p className="mt-1 text-body-1 text-neutral">
              {[task.course, task.deadline && `Tenggat ${dayLabel(task.deadline)}`].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-neutral hover:bg-neutral-light hover:text-danger"
          aria-label={`Hapus tugas ${task.title}`}
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-body-3">
          <span className="font-medium text-neutral">Progres keseluruhan</span>
          <span className="font-heading font-semibold text-green">{percent}% selesai</span>
        </div>
        <Progress value={percent} aria-label={`Progres ${task.title}`} className="h-3" />
      </div>

      <div className="mt-6 border-t border-border pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-heading text-body-3 font-semibold tracking-[0.6px] text-neutral uppercase">
            LANGKAH KECIL
          </p>
          <span className="text-body-4 font-medium text-neutral">
            {done}/{steps.length} selesai
          </span>
        </div>

        {steps.length > 0 ? (
          <ul className="space-y-3">
            {steps.map((s) => (
              <StepRow
                key={s.id}
                step={s}
                api={api}
                isSelected={selectedStepId === s.id && !s.is_done}
              />
            ))}
          </ul>
        ) : (
          <p className="rounded-[16px] border border-dashed border-border p-5 text-center text-body-2 text-neutral">
            Belum ada langkah. Mulai dari yang paling kecil, misalnya "baca 2 artikel referensi".
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <AddStepForm taskId={task.id} onAdd={api.addMicroTask} />
      </div>

      {steps.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-body-3 border-t border-border pt-4">
          <span className="font-medium text-neutral">
            {steps.length} tugas mikro · perkiraan {estimatedMin} mnt
          </span>
          <span className="font-medium text-green">
            Siap kapan pun kamu nyaman
          </span>
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-h3 font-bold text-neutral-darker">
              Hapus "{task.title}"?
            </DialogTitle>
            <DialogDescription className="text-body-2 text-muted-foreground">
              Semua langkah di dalamnya ikut terhapus dan tidak bisa dikembalikan.
            </DialogDescription>
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

export function StepRow({
  step,
  api,
  isSelected = false,
}: {
  step: MicroTask
  api: Pick<Api, 'updateMicroTask' | 'deleteMicroTask'>
  isSelected?: boolean
}) {
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
      className={cn(
        'group relative flex min-h-[58px] items-center justify-between gap-3.5 rounded-[20px] border p-4 transition-all',
        isSelected
          ? 'border-2 border-green bg-green-light shadow-xs'
          : 'border-border bg-white hover:border-border/80',
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <Checkbox
          id={id}
          checked={step.is_done}
          onCheckedChange={(v) => api.updateMicroTask(step.id, { is_done: v === true })}
          className={cn(isSelected && !step.is_done && 'border-green')}
        />

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
              className="h-9 text-body-1"
            />
          </form>
        ) : (
          <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
            <span
              className={cn(
                'block break-words text-body-2 font-medium tracking-[0.1px] transition-colors',
                step.is_done
                  ? 'text-neutral/60 line-through'
                  : isSelected
                    ? 'font-semibold text-green'
                    : 'text-neutral-darker',
              )}
            >
              {step.title}
            </span>
            {isSelected && !step.is_done ? (
              <span className="block text-body-3 font-medium text-neutral-darker">
                Dipilih untuk sesi fokusmu berikutnya
              </span>
            ) : (
              <span className="text-body-4 text-neutral">
                {dayLabel(step.planned_date)}
              </span>
            )}
          </label>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-neutral-light px-3 py-1 font-heading text-body-3 font-medium text-neutral">
          15 mnt
        </span>

        {!editing && (
          <Button
            variant="ghost"
            size="icon-xs"
            className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
            aria-label={`Ubah langkah ${step.title}`}
            onClick={() => setEditing(true)}
          >
            <Pencil className="size-3.5 text-neutral hover:text-neutral-darker" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          aria-label={`Hapus langkah ${step.title}`}
          onClick={() => api.deleteMicroTask(step.id)}
        >
          <Trash2 className="size-3.5 text-neutral hover:text-danger" />
        </Button>
      </div>
    </li>
  )
}

function AddStepForm({ taskId, onAdd }: { taskId: string; onAdd: TasksApi['addMicroTask'] }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayLocal())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const titleId = `new-step-${taskId}`
  const dateId = `new-step-date-${taskId}`

  async function submit(e: FormEvent) {
    e.preventDefault()
    const clean = title.trim()
    if (!clean) return
    setIsSubmitting(true)
    await onAdd({ task_id: taskId, title: clean, planned_date: date })
    setIsSubmitting(false)
    setTitle('')
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Plus className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral" />
        <Input
          id={titleId}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Langkah kecil berikutnya"
          className="h-10 rounded-[10px] pl-9 text-body-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Calendar className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-neutral" />
          <Input
            id={dateId}
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 w-[140px] rounded-[10px] pl-8 pr-2 text-body-3"
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={!title.trim() || isSubmitting}
          className="h-10 shrink-0 rounded-[10px] px-3 font-medium"
        >
          {isSubmitting ? 'Menambah…' : '+ Langkah'}
        </Button>
      </div>
    </form>
  )
}
