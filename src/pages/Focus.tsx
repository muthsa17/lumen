import { Link } from 'react-router'
import { AppHeader } from '@/components/AppHeader'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ENERGY_COPY } from '@/features/checkin/energy-copy'
import { useFocusSession } from '@/features/focus/focus-session'
import { useTasks } from '@/hooks/useTasks'
import { todayLocal } from '@/lib/date'
import { splitToday } from '@/lib/energy'

const mmss = (ms: number) => {
  const s = Math.ceil(ms / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function Focus() {
  const today = todayLocal()
  const { checkin, level, rules, timer, note, startFocus } = useFocusSession()
  const { tasks, microTasks, loading } = useTasks()

  const running = timer.state !== null
  const phase = timer.state?.phase ?? 'focus'
  const totalMs = (phase === 'focus' ? rules.focusMin : rules.breakMin) * 60_000
  const shownMs = running ? timer.remaining : totalMs
  const elapsedPct = running ? Math.max(0, Math.min(100, Math.round(((totalMs - timer.remaining) / totalMs) * 100))) : 0

  const current = splitToday(microTasks, today, rules.maxTasks).focus.find((m) => !m.is_done)
  const currentTask = current && tasks.find((t) => t.id === current.task_id)

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="sr-only">Sesi fokus</h1>

        <section aria-label="Timer" className="rounded-panel bg-mint px-4 py-8 text-center sm:px-10 sm:py-12">
          <p className="text-body font-semibold text-emerald-deep">{phase === 'focus' ? 'Sesi fokus' : 'Jeda'}</p>
          <p className="mt-2 text-[4.5rem] leading-none font-bold tracking-tight text-emerald-deep tabular-nums sm:text-[6rem]" role="timer" aria-live="off">
            {mmss(shownMs)}
          </p>
          <Progress value={elapsedPct} aria-label="Waktu berjalan" className="mx-auto mt-6 h-2 max-w-sm bg-card" />

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {running ? (
              <Button size="lg" variant="outline" onClick={timer.stop} className="w-full sm:w-auto">
                Berhenti
              </Button>
            ) : (
              <Button size="lg" onClick={startFocus} disabled={checkin.loading} className="w-full sm:w-auto">
                Mulai fokus {rules.focusMin} menit
              </Button>
            )}
          </div>
        </section>

        <section aria-label="Konteks sesi" className="mt-6 space-y-4">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-body text-muted-foreground">Langkah sekarang</p>
            {loading ? (
              <p role="status" className="mt-1 text-body text-muted-foreground">
                Memuat…
              </p>
            ) : current ? (
              <>
                <p className="mt-1 text-card-title font-semibold break-words text-ink">{current.title}</p>
                {currentTask && <p className="text-body text-muted-foreground">{currentTask.title}</p>}
              </>
            ) : (
              <p className="mt-1 text-body">
                Tidak ada langkah tersisa untuk hari ini.{' '}
                <Link to="/app" className="font-semibold text-emerald-deep underline underline-offset-4">
                  Tambah langkah
                </Link>
              </p>
            )}
          </div>

          <p className="text-body text-ink-soft">
            Energi {ENERGY_COPY[level].label.toLowerCase()}
            {checkin.level === null && ' (belum check-in)'}: fokus {rules.focusMin} menit, jeda {rules.breakMin} menit.{' '}
            <Link to="/app" className="font-semibold text-emerald-deep underline underline-offset-4">
              Ubah energi
            </Link>
          </p>
          {note && <p className="text-body text-ink-soft">{note}</p>}
        </section>
      </main>

    </>
  )
}
