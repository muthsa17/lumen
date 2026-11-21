import { Play, RotateCcw, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useFocusSession } from '@/features/focus/focus-session'
import type { MicroTask } from '@/hooks/useTasks'

const mmss = (ms: number) => {
  const s = Math.ceil(ms / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export function DashboardTimerCard({ focusTask }: { focusTask?: MicroTask }) {
  const { rules, timer, startFocus } = useFocusSession()
  const running = timer.state !== null
  const isFocusPhase = (timer.state?.phase ?? 'focus') === 'focus'
  const totalMs = (isFocusPhase ? rules.focusMin : rules.breakMin) * 60_000
  const shownMs = running ? timer.remaining : totalMs
  const elapsedFraction = running ? Math.max(0, Math.min(1, (totalMs - timer.remaining) / totalMs)) : 0

  const radius = 100
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - elapsedFraction)

  return (
    <div className="flex flex-col items-center rounded-[20px] border border-border bg-card p-6 text-center drop-shadow-xs sm:p-8">
      {/* Heading & Subtitle */}
      <h2 className="font-heading text-[18px] font-semibold text-neutral-darker">
        Pengatur Waktu Fokus Adaptif
      </h2>
      <div className="mt-1">
        <span className="font-heading text-[12px] font-medium tracking-[0.6px] uppercase text-neutral-active">
          {running ? (isFocusPhase ? 'SESI FOKUS' : 'SESI JEDA') : 'SESI FOKUS'}
        </span>
      </div>

      {/* Circular Countdown Ring with Top Orange Marker */}
      <div className="relative my-5 flex size-[240px] items-center justify-center">
        <svg className="size-full -rotate-90" viewBox="0 0 240 240">
          {/* Background Ring */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke="var(--green-light-active)"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress Arc */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke="var(--primary)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={running ? strokeDashoffset : 0}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500 ease-linear"
          />
        </svg>

        {/* Top Orange Dot Accent Marker (Figma node 166:433) */}
        <div
          className="pointer-events-none absolute top-[8px] left-[110px] size-[20px] rounded-full border-2 border-white bg-accent shadow-md"
          aria-hidden="true"
        />

        {/* Center Digital Clock Display */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-[56px] font-bold leading-none tracking-[-1.4px] text-neutral-darker tabular-nums">
            {mmss(shownMs)}
          </span>
          <span className="mt-2 font-heading text-[12px] font-medium tracking-[0.6px] uppercase text-neutral-active">
            {running ? (isFocusPhase ? 'TERSISA' : 'JEDA TERSISA') : 'TERSISA'}
          </span>
        </div>
      </div>

      {/* Target Task info */}
      <div className="mb-5 w-full text-center">
        <p className="font-heading text-[14px] text-neutral-darker">
          <span className="font-medium text-neutral-active">Fokus pada: </span>
          <span className="font-semibold text-primary">
            {focusTask ? focusTask.title : 'Pilih langkah untuk mulai'}
          </span>
        </p>
      </div>

      {/* Controls */}
      <div className="flex w-full items-center gap-3">
        {running ? (
          <>
            <Button asChild size="lg" className="h-[52px] flex-1 rounded-[12px] bg-primary font-heading text-[16px] font-medium text-white shadow-xs hover:bg-green-hover">
              <Link to="/focus" className="flex items-center justify-center gap-2">
                <span>Buka Layar Fokus</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={timer.stop}
              className="h-[52px] rounded-[12px] border-border px-5 font-heading text-[16px] font-medium text-neutral-darker"
            >
              <RotateCcw className="mr-1.5 size-4" />
              Atur Ulang
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              size="lg"
              onClick={startFocus}
              className="h-[52px] flex-1 rounded-[12px] bg-primary font-heading text-[16px] font-medium text-white shadow-xs hover:bg-green-hover"
            >
              <Play className="mr-2 size-4 fill-current" />
              Mulai Fokus
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={timer.stop}
              className="h-[52px] rounded-[12px] border-border px-5 font-heading text-[16px] font-medium text-neutral-darker"
            >
              <RotateCcw className="mr-1.5 size-4" />
              Atur Ulang
            </Button>
          </>
        )}
      </div>

      <p className="mt-4 font-heading text-[12px] font-medium text-neutral-active">
        Sesi {rules.focusMin} menit · Disesuaikan dengan energimu
      </p>
    </div>
  )
}
