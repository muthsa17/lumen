import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ENERGY_COPY, ruleSummary } from '@/features/checkin/energy-copy'
import type { MicroTask, Task, TasksApi } from '@/hooks/useTasks'
import { todayLocal } from '@/lib/date'
import { ENERGY_RULES, splitToday, type EnergyLevel } from '@/lib/energy'
import { tomorrowLocal } from '@/lib/format'

type Props = {
  tasks: Task[]
  microTasks: MicroTask[]
  level: EnergyLevel
  checkedIn: boolean
  onChangeEnergy: () => void
  onUpdate: TasksApi['updateMicroTask']
}

export function TodayList({ tasks, microTasks, level, checkedIn, onChangeEnergy, onUpdate }: Props) {
  const { focus, later } = splitToday(microTasks, todayLocal(), ENERGY_RULES[level].maxTasks)
  const taskTitle = (id: string) => tasks.find((t) => t.id === id)?.title ?? ''
  const { label, icon: Icon } = ENERGY_COPY[level]
  const done = focus.filter((m) => m.is_done).length

  return (
    <section aria-labelledby="today-title" className="rounded-panel bg-green-light p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-yellow-light p-3 ring-1 ring-yellow">
        <Icon aria-hidden="true" className="size-6 shrink-0 text-yellow-darker" />
        <p className="min-w-0 flex-1 text-body-2 text-ink">
          <span className="font-bold">Energi {checkedIn ? label : `${label} (belum check-in)`}</span>
          <span className="block text-neutral-darker">{ruleSummary(level)}</span>
        </p>
        <Button variant="outline" onClick={onChangeEnergy}>
          {checkedIn ? 'Ubah' : 'Check-in'}
        </Button>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h2 id="today-title" className="text-h1 font-bold">
          Fokus hari ini
        </h2>
        {focus.length > 0 && (
          <span className="text-body-2 text-neutral-darker">
            {done}/{focus.length} selesai
          </span>
        )}
      </div>

      {focus.length === 0 ? (
        <p className="mt-3 text-body-1 text-neutral-darker">
          Belum ada langkah untuk hari ini. Tambahkan langkah di salah satu tugasmu dengan tanggal hari ini.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {focus.map((m) => (
            <li key={m.id} className="flex min-h-14 items-center gap-3 rounded-lg bg-card px-3 py-2">
              <Checkbox id={`today-${m.id}`} checked={m.is_done} onCheckedChange={(v) => onUpdate(m.id, { is_done: v === true })} />
              <label htmlFor={`today-${m.id}`} className="min-w-0 flex-1 cursor-pointer">
                <span className={m.is_done ? 'block break-words text-body-1 text-muted-foreground line-through' : 'block break-words text-body-1 font-semibold'}>
                  {m.title}
                </span>
                <span className="block truncate text-body-3 text-muted-foreground">{taskTitle(m.task_id)}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {focus.some((m) => !m.is_done) && (
        <Button asChild size="lg" className="mt-4 w-full sm:w-auto">
          <Link to="/focus">Mulai sesi fokus</Link>
        </Button>
      )}

      {later.length > 0 && (
        <div className="mt-6 border-t border-green-light-active pt-4">
          <h3 className="text-h4 font-bold">Bisa ditunda</h3>
          <p className="mt-1 text-body-2 text-neutral-darker">
            Energi kamu hari ini {label.toLowerCase()}. Langkah ini boleh digeser ke besok, tidak apa-apa.
          </p>
          <ul className="mt-3 space-y-2">
            {later.map((m) => (
              <li key={m.id} className="flex min-h-14 flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-dashed border-green-light-active bg-card/60 px-3 py-2">
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-body-1">{m.title}</span>
                  <span className="block truncate text-body-3 text-muted-foreground">{taskTitle(m.task_id)}</span>
                </span>
                <Button variant="ghost" onClick={() => onUpdate(m.id, { planned_date: tomorrowLocal() })}>
                  Geser ke besok
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
