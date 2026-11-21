import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { Button } from '@/components/ui/button'
import { CheckinDialog } from '@/features/checkin/CheckinDialog'
import { DashboardTimerCard } from '@/features/focus/DashboardTimerCard'
import { NextMindfulBreakCard } from '@/features/focus/NextMindfulBreakCard'
import { useFocusSession } from '@/features/focus/focus-session'
import { TaskCard } from '@/features/tasks/TaskCard'
import { TaskForm } from '@/features/tasks/TaskForm'
import { useTasks } from '@/hooks/useTasks'
import { todayLocal } from '@/lib/date'
import { DEFAULT_LEVEL, ENERGY_RULES, splitToday } from '@/lib/energy'
import { tomorrowLocal } from '@/lib/format'

export default function Dashboard() {
  const api = useTasks()
  const { tasks, microTasks, loading, error, reload } = api
  const { checkin } = useFocusSession()
  const [checkinOpen, setCheckinOpen] = useState(false)
  // Ask once per day; a failed lookup must not nag the user with the dialog.
  const needsCheckin = !checkin.loading && !checkin.error && checkin.level === null
  const [dismissed, setDismissed] = useState(false)

  const currentLevel = checkin.level ?? DEFAULT_LEVEL
  const { focus, later } = splitToday(microTasks, todayLocal(), ENERGY_RULES[currentLevel].maxTasks)
  const currentFocusTask = focus.find((m) => !m.is_done) ?? microTasks.find((m) => !m.is_done)
  const taskTitle = (id: string) => tasks.find((t) => t.id === id)?.title ?? ''

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader onOpenCheckin={() => setCheckinOpen(true)} />

      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-8 sm:py-10">
        {/* Daily Introduction Banner (Figma 166:274) */}
        <div className="mb-8 space-y-1.5">
          <h1 className="font-heading text-[32px] sm:text-[40px] font-bold text-neutral-darker leading-[1.15] tracking-[-0.5px]">
            A little focus. A little progress
          </h1>
          <p className="text-body-1 text-neutral-active">
            Pecah tujuan besar jadi langkah kecil, dan kerjakan sesuai energimu.
          </p>
        </div>

        {/* 7 / 5 Grid Layout (Figma node 166:274) */}
        <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-12">
          {/* Left Column (7 cols): Tasks and Micro-task breakdown */}
          <section aria-labelledby="tasks-heading" className="space-y-6 lg:col-span-7">
            <div className="flex items-center justify-between gap-3">
              <h2 id="tasks-heading" className="font-heading text-[22px] font-bold text-neutral-darker">
                Tugas Fokus Hari Ini
              </h2>
              <span className="rounded-full bg-green-light px-3 py-1 font-heading text-[12px] font-semibold text-green">
                {tasks.length} tugas aktif
              </span>
            </div>

            {/* Form Tambah Tugas Besar */}
            <TaskForm onAdd={api.addTask} />

            {/* List Tugas */}
            {loading ? (
              <div role="status" className="rounded-[20px] border border-border bg-card p-8 text-center text-body-1 text-neutral-active drop-shadow-xs">
                Memuat tugas dan langkah…
              </div>
            ) : error ? (
              <div role="alert" className="rounded-[20px] border border-danger/40 bg-card p-6 drop-shadow-xs">
                <p className="font-heading text-h4 font-semibold text-danger">Tugas gagal dimuat</p>
                <p className="mt-1 text-body-2 text-neutral-active">{error}. Periksa koneksi internet, lalu coba lagi.</p>
                <Button variant="outline" className="mt-4 rounded-[12px]" onClick={reload}>
                  Muat ulang
                </Button>
              </div>
            ) : tasks.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border bg-card/60 p-8 text-center drop-shadow-xs">
                <p className="font-heading text-h3 font-semibold text-neutral-darker">Belum ada tugas</p>
                <p className="mt-1 text-body-2 text-neutral-active">
                  Tulis satu tugas besar di atas, lalu pecah menjadi beberapa langkah kecil harian.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {tasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    steps={microTasks.filter((m) => m.task_id === t.id)}
                    api={api}
                    selectedStepId={currentFocusTask?.id}
                  />
                ))}
              </div>
            )}

            {/* Bagian Bisa Ditunda (Batas soft limit sesuai spec §4.2) */}
            {later.length > 0 && (
              <div className="mt-8 rounded-[20px] border border-border bg-card p-6 drop-shadow-xs sm:p-7">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading text-h3 font-bold text-neutral-darker">
                    Bisa Ditunda
                  </h3>
                  <span className="rounded-full bg-yellow-light px-2.5 py-0.5 text-body-4 font-semibold text-yellow-darker">
                    {later.length} langkah
                  </span>
                </div>
                <p className="mt-1.5 text-body-2 text-neutral-active">
                  Langkah-langkah berikut melebihi kapasitas energimu hari ini. Boleh digeser ke besok tanpa rasa tertekan.
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
                        onClick={() => api.updateMicroTask(m.id, { planned_date: tomorrowLocal() })}
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

          {/* Right Column (5 cols): Adaptive Timer and Next Mindful Break */}
          <aside aria-label="Timer dan Jeda" className="space-y-6 lg:col-span-5 lg:sticky lg:top-6">
            <DashboardTimerCard focusTask={currentFocusTask} />
            <NextMindfulBreakCard />
          </aside>
        </div>
      </main>

      <CheckinDialog
        open={checkinOpen || (needsCheckin && !dismissed)}
        onOpenChange={(o) => {
          setCheckinOpen(o)
          if (!o && needsCheckin) setDismissed(true)
        }}
        current={checkin.level}
        onPick={checkin.setLevel}
      />
    </div>
  )
}
