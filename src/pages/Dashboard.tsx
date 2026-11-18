import { useState } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { Button } from '@/components/ui/button'
import { CheckinDialog } from '@/features/checkin/CheckinDialog'
import { TaskCard } from '@/features/tasks/TaskCard'
import { TaskForm } from '@/features/tasks/TaskForm'
import { useFocusSession } from '@/features/focus/focus-session'
import { TodayList } from '@/features/tasks/TodayList'
import { useTasks } from '@/hooks/useTasks'
import { DEFAULT_LEVEL } from '@/lib/energy'

export default function Dashboard() {
  const api = useTasks()
  const { tasks, microTasks, loading, error, reload } = api
  const { checkin } = useFocusSession()
  const [checkinOpen, setCheckinOpen] = useState(false)
  // Ask once per day; a failed lookup must not nag the user with the dialog.
  const needsCheckin = !checkin.loading && !checkin.error && checkin.level === null
  const [dismissed, setDismissed] = useState(false)

  return (
    <>
      <AppHeader />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-8">
        <h1 className="sr-only">Dashboard LUMEN</h1>

        <div className="lg:sticky lg:top-6">
          {loading ? (
            <p role="status" className="rounded-panel bg-green-light p-6 text-body-1 text-neutral-darker">
              Memuat langkah hari ini…
            </p>
          ) : error ? null : (
            <TodayList
              tasks={tasks}
              microTasks={microTasks}
              level={checkin.level ?? DEFAULT_LEVEL}
              checkedIn={checkin.level !== null}
              onChangeEnergy={() => setCheckinOpen(true)}
              onUpdate={api.updateMicroTask}
            />
          )}
        </div>

        <section aria-labelledby="tasks-title" className="space-y-4">
          <h2 id="tasks-title" className="text-h2 font-bold">
            Semua tugas
          </h2>
          <TaskForm onAdd={api.addTask} />
          {loading ? (
            <p role="status" className="text-body-1 text-muted-foreground">
              Memuat tugas…
            </p>
          ) : error ? (
            <div role="alert" className="rounded-xl border border-danger bg-card p-4">
              <p className="text-body-1 font-semibold">Tugas gagal dimuat.</p>
              <p className="mt-1 text-body-2 text-muted-foreground">{error}. Periksa koneksi internet, lalu coba lagi.</p>
              <Button variant="outline" className="mt-3" onClick={reload}>
                Muat ulang
              </Button>
            </div>
          ) : tasks.length === 0 ? (
            <p className="rounded-xl border border-dashed p-6 text-center text-body-1 text-muted-foreground">
              Belum ada tugas. Tulis satu tugas besar di atas, lalu pecah jadi langkah kecil.
            </p>
          ) : (
            <div className="grid gap-4">
              {tasks.map((t) => (
                <TaskCard key={t.id} task={t} steps={microTasks.filter((m) => m.task_id === t.id)} api={api} />
              ))}
            </div>
          )}
        </section>
      </main>

      <CheckinDialog
        open={checkinOpen || (needsCheckin && !dismissed)}
        onOpenChange={(o) => {
          setCheckinOpen(o)
          if (!o) setDismissed(true)
        }}
        current={checkin.level}
        onPick={checkin.setLevel}
      />
    </>
  )
}
