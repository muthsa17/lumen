import { Link } from 'react-router'
import { ArrowRight, Calendar, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ENERGY_COPY, ruleSummary } from '@/features/checkin/energy-copy'
import { EnergyBatteryIcon } from '@/components/AppHeader'
import type { MicroTask, Task, TasksApi } from '@/hooks/useTasks'
import { todayLocal } from '@/lib/date'
import { ENERGY_RULES, splitToday, type EnergyLevel } from '@/lib/energy'
import { tomorrowLocal } from '@/lib/format'
import { cn } from '@/lib/utils'

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
  const { label } = ENERGY_COPY[level]
  const done = focus.filter((m) => m.is_done).length
  const firstUnfinished = focus.find((m) => !m.is_done)

  return (
    <section aria-labelledby="today-title" className="space-y-6">
      {/* Energy Level Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-green-light-active bg-green-light p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-xs">
            <EnergyBatteryIcon level={checkedIn ? level : null} />
          </div>
          <div>
            <p className="font-heading text-body-1 font-bold text-neutral-darker">
              Energi {checkedIn ? label : `${label} (Belum check-in)`}
            </p>
            <p className="text-body-3 text-neutral-active">
              {ruleSummary(level)}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onChangeEnergy}
          className="rounded-[12px] border-green/20 bg-card font-medium text-green hover:bg-green-light-hover"
        >
          {checkedIn ? 'Ubah Energi' : 'Check-in Sekarang'}
        </Button>
      </div>

      {/* Fokus Hari Ini Card */}
      <div className="rounded-[20px] border border-border bg-card p-6 drop-shadow-xs sm:p-7">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 id="today-title" className="font-heading text-h2 font-bold text-neutral-darker">
              Fokus Hari Ini
            </h2>
            <span className="rounded-full bg-green-light px-2.5 py-0.5 font-heading text-body-4 font-semibold text-green">
              {focus.length} langkah
            </span>
          </div>
          {focus.length > 0 && (
            <span className="text-body-3 font-medium text-neutral-active">
              {done}/{focus.length} selesai
            </span>
          )}
        </div>

        {focus.length === 0 ? (
          <p className="mt-4 rounded-[12px] border border-dashed border-border p-5 text-center text-body-1 text-neutral-active">
            Belum ada langkah untuk hari ini. Tambahkan langkah pada tugas di bawah dengan tanggal hari ini.
          </p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {focus.map((m) => {
              const isNext = firstUnfinished?.id === m.id
              return (
                <li
                  key={m.id}
                  className={cn(
                    'flex min-h-[56px] items-center gap-3.5 rounded-[12px] border p-3.5 transition-all',
                    isNext
                      ? 'border-green-light-active bg-green-light shadow-xs'
                      : 'border-border bg-card hover:border-neutral-light-active',
                  )}
                >
                  <Checkbox
                    id={`today-${m.id}`}
                    checked={m.is_done}
                    onCheckedChange={(v) => onUpdate(m.id, { is_done: v === true })}
                    className={cn(isNext && !m.is_done && 'border-green')}
                  />
                  <label htmlFor={`today-${m.id}`} className="min-w-0 flex-1 cursor-pointer">
                    <span
                      className={cn(
                        'block break-words text-body-1 font-medium transition-colors',
                        m.is_done
                          ? 'text-neutral-active line-through'
                          : isNext
                            ? 'font-semibold text-green'
                            : 'text-neutral-darker',
                      )}
                    >
                      {m.title}
                    </span>
                    <span className="block truncate text-body-4 text-neutral-active">
                      {isNext && !m.is_done ? 'Dipilih untuk sesi fokus berikutnya · ' : ''}
                      {taskTitle(m.task_id)}
                    </span>
                  </label>
                  <span className="shrink-0 rounded-full bg-neutral-light px-2.5 py-1 font-heading text-body-4 font-semibold text-neutral-darker">
                    15m
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {focus.some((m) => !m.is_done) && (
          <Button asChild size="lg" className="mt-5 h-[52px] w-full rounded-[12px] font-heading text-body-1">
            <Link to="/focus" className="flex items-center justify-center gap-2">
              <Sparkles className="size-4" />
              <span>Mulai sesi fokus</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Bagian Bisa Ditunda (Soft limit sesuai spec §4.2) */}
      {later.length > 0 && (
        <div className="rounded-[20px] border border-border bg-card p-6 drop-shadow-xs sm:p-7">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-heading text-h3 font-bold text-neutral-darker">
              Bisa Ditunda
            </h3>
            <span className="rounded-full bg-yellow-light px-2.5 py-0.5 text-body-4 font-semibold text-yellow-darker">
              {later.length} langkah
            </span>
          </div>
          <p className="mt-1.5 text-body-2 text-neutral-active">
            Energi kamu hari ini {label.toLowerCase()}. Langkah di bawah ini melebihi target energi harian dan boleh digeser ke besok tanpa rasa bersalah.
          </p>
          <ul className="mt-4 space-y-2.5">
            {later.map((m) => (
              <li
                key={m.id}
                className="flex min-h-[56px] flex-wrap items-center justify-between gap-3 rounded-[12px] border border-dashed border-border bg-neutral-light/50 p-3.5"
              >
                <div className="min-w-0 flex-1">
                  <span className="block break-words text-body-1 font-medium text-neutral-darker">
                    {m.title}
                  </span>
                  <span className="block truncate text-body-4 text-neutral-active">
                    {taskTitle(m.task_id)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdate(m.id, { planned_date: tomorrowLocal() })}
                  className="gap-1.5 rounded-[12px] font-medium text-neutral-darker hover:border-green hover:text-green"
                >
                  <Calendar className="size-3.5" />
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
