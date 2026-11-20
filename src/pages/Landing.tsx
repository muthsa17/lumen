import { ListChecks, Timer, BatteryMedium } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { StepMark } from '@/components/StepMark'
import { Button } from '@/components/ui/button'
import { ENERGY_COPY, ENERGY_ORDER } from '@/features/checkin/energy-copy'
import { useAuth } from '@/features/auth/auth-context'
import { ENERGY_RULES, type EnergyLevel } from '@/lib/energy'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    icon: ListChecks,
    title: 'Pecah tugas besar jadi langkah harian',
    body: 'Makalah 20 halaman terasa berat. "Cari 3 referensi hari ini" tidak. Tulis tugasnya, lalu pecah jadi langkah kecil yang bisa dicentang.',
  },
  {
    icon: BatteryMedium,
    title: 'Target ikut energimu, bukan sebaliknya',
    body: 'Setiap hari kamu memilih energi tinggi, sedang, atau rendah. LUMEN membatasi jumlah langkah hari itu, sisanya boleh digeser ke besok.',
  },
  {
    icon: Timer,
    title: 'Fokus dengan jeda yang benar-benar dipakai',
    body: 'Timer fokus berakhir dengan bunyi dan saran peregangan atau latihan napas, supaya istirahatnya tidak terlewat.',
  },
]

function useGuestStart() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  async function start() {
    setBusy(true)
    const { error } = await supabase.auth.signInAnonymously()
    setBusy(false)
    if (error) return toast.error(error.message)
    navigate('/app')
  }
  return { start, busy }
}

function EnergyPreview() {
  const [level, setLevel] = useState<EnergyLevel>('medium')
  const r = ENERGY_RULES[level]
  return (
    <div className="rounded-panel bg-card p-5 shadow-lg ring-1 ring-soft-mint sm:p-6">
      <p id="energy-preview-label" className="text-card-title font-bold text-ink">
        Energimu hari ini?
      </p>
      <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-muted p-1" role="group" aria-labelledby="energy-preview-label">
        {ENERGY_ORDER.map((lvl) => (
          <button
            key={lvl}
            type="button"
            aria-pressed={level === lvl}
            onClick={() => setLevel(lvl)}
            className={cn(
              'h-11 rounded-md text-body font-semibold text-muted-foreground transition-colors hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
              level === lvl && 'bg-gold text-ink',
            )}
          >
            {ENERGY_COPY[lvl].label}
          </button>
        ))}
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3 text-center" aria-live="polite">
        {[
          ['Fokus', `${r.focusMin}`, 'menit'],
          ['Jeda', `${r.breakMin}`, 'menit'],
          ['Langkah', `${r.maxTasks}`, 'hari ini'],
        ].map(([label, value, unit]) => (
          <div key={label} className="rounded-lg bg-mint px-2 py-3">
            <dt className="text-caption font-semibold text-emerald-deep">{label}</dt>
            <dd className="text-[2rem] leading-tight font-bold text-ink tabular-nums">{value}</dd>
            <dd className="text-caption text-ink-soft">{unit}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-body text-ink-soft">Ini aturan yang dipakai LUMEN. Coba ganti energinya.</p>
    </div>
  )
}

export default function Landing() {
  const { session } = useAuth()
  const guest = useGuestStart()

  const primaryCta = session ? (
    <Button asChild size="lg">
      <Link to="/app">Buka tugas hari ini</Link>
    </Button>
  ) : (
    <Button size="lg" onClick={guest.start} disabled={guest.busy}>
      {guest.busy ? 'Menyiapkan…' : 'Coba tanpa daftar'}
    </Button>
  )

  return (
    <div className="min-h-dvh bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <span className="text-section font-bold text-ink">LUMEN</span>
        {!session && (
          <Button asChild variant="ghost">
            <Link to="/login">Masuk</Link>
          </Button>
        )}
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-6 pb-14 sm:px-6 md:grid-cols-2 md:items-center md:gap-12 lg:pt-14 lg:pb-20">
          <div>
            <StepMark className="mb-6" />
            <h1 className="text-[2rem] leading-[1.15] font-bold sm:text-[2.75rem]">Tugas numpuk? Mulai dari satu langkah kecil.</h1>
            <p className="mt-4 max-w-lg text-body leading-relaxed text-ink-soft sm:text-lg">
              LUMEN membantu mahasiswa memecah tugas kuliah jadi langkah harian, menyesuaikan target dengan energi hari ini, dan
              mengingatkan untuk istirahat sebelum kelelahan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {primaryCta}
              {!session && (
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Daftar dengan email</Link>
                </Button>
              )}
            </div>
          </div>
          <EnergyPreview />
        </section>

        <section aria-labelledby="features-title" className="bg-mint">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
            <h2 id="features-title" className="max-w-xl text-hero font-bold sm:text-[2rem] sm:leading-tight">
              Dibuat untuk hari-hari ketika semua deadline datang bersamaan
            </h2>
            <ul className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-x-12">
              {FEATURES.map(({ icon: Icon, title, body }, i) => (
                <li key={title} className={cn('flex gap-4', i === 0 && 'md:row-span-2 md:flex-col md:justify-center md:rounded-panel md:bg-card md:p-8')}>
                  <Icon aria-hidden="true" className={cn('size-7 shrink-0 text-emerald-deep', i === 0 && 'md:size-9')} />
                  <div>
                    <h3 className={cn('text-card-title font-bold', i === 0 && 'md:text-section')}>{title}</h3>
                    <p className="mt-2 text-body leading-relaxed text-ink-soft">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="cta-title" className="bg-cream">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="cta-title" className="text-hero font-bold">
                Satu langkah hari ini sudah cukup.
              </h2>
              <p className="mt-2 text-body text-ink-soft">Tidak perlu daftar dulu. Data tamu bisa disimpan dengan email kapan saja.</p>
            </div>
            <div className="shrink-0">{primaryCta}</div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-body text-muted-foreground sm:px-6">LUMEN · Girls Code Jam 2026, Kelompok 6</footer>
    </div>
  )
}
