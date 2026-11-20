import {
  ArrowDownUp,
  ArrowRight,
  BatteryFull,
  Brain,
  Menu,
  BatteryLow,
  BatteryMedium,
  ChevronDown,
  CircleCheck,
  CirclePlay,
  CircleHelp,
  Rows2,
  ShieldCheck,
  SlidersHorizontal,
  Sprout,
  Timer,
  Wind,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth-context'
import { ENERGY_RULES, type EnergyLevel } from '@/lib/energy'
import { ENERGY_MODES, FAQ, FEATURES, NAV_LINKS, STEPS } from '@/lib/landing'
import { cn } from '@/lib/utils'

const FEATURE_ICONS: [LucideIcon, LucideIcon][] = [
  [Rows2, CircleCheck],
  [Timer, SlidersHorizontal],
  [Wind, Sprout],
]
const MODE_ICONS: Record<EnergyLevel, LucideIcon> = {
  low: BatteryLow,
  medium: BatteryMedium,
  high: BatteryFull,
}
const focusRing =
  'focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
const container = 'mx-auto w-full max-w-[1136px] px-4 sm:px-6 lg:px-0'

function SectionHead({
  id,
  icon: Icon,
  label,
  title,
  children,
}: {
  id: string
  icon: LucideIcon
  label: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-caption text-emerald-deep ring-1 ring-soft-mint">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </span>
      <h2
        id={id}
        className="mt-3 text-hero text-ink sm:text-[2rem] sm:leading-10"
      >
        {title}
      </h2>
      <p className="mt-3 text-body leading-relaxed text-ink-soft sm:text-base">
        {children}
      </p>
    </div>
  )
}

function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-section font-bold tracking-wider text-emerald-deep',
        className,
      )}
    >
      <img
        src="/logo.png"
        alt=""
        width={28}
        height={28}
        className="size-7 rounded-full"
      />
      LUMEN
    </span>
  )
}

function PreviewCard() {
  const { focusMin } = ENERGY_RULES.high
  return (
    <div
      aria-hidden="true"
      className="rounded-panel bg-card p-6 shadow-lg ring-1 ring-border"
    >
      <div className="flex items-center justify-between border-b border-border pb-3 text-caption text-ink-soft">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-success" />
          Sesi Fokus LUMEN
        </span>
        <span className="flex items-center gap-1 rounded-full bg-mint px-2 py-1 text-emerald-deep">
          <BatteryFull className="size-3.5" />
          Fokus Tinggi
        </span>
      </div>
      <div className="mt-4 flex justify-between text-caption text-ink-soft">
        <span>Tujuan: Publikasi Buletin</span>
        <span>2 dari 3 langkah</span>
      </div>
      <div className="mt-1.5 h-2.5 rounded-full bg-soft-mint">
        <div className="h-full w-2/3 rounded-full bg-emerald-deep" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-mint p-4 ring-1 ring-soft-mint">
        <div>
          <p className="text-body font-semibold text-ink">Tulis 3 poin utama</p>
          <p className="text-caption text-ink-soft">Draf awal, tanpa revisi</p>
        </div>
        <span className="rounded-full bg-card px-3 py-1 text-caption text-ink-soft">
          12 mnt
        </span>
      </div>
      <div className="mt-4 rounded-xl bg-background p-5 text-center ring-1 ring-border">
        <p className="text-caption text-ink-soft">
          Pengatur Waktu Fokus Adaptif
        </p>
        <div className="relative mx-auto mt-4 grid size-40 place-items-center rounded-full border-8 border-emerald-deep/20 border-t-emerald-deep">
          <span className="absolute -top-2 right-5 size-3.5 rounded-full bg-amber" />
          <div>
            <p className="text-[1.75rem] leading-8 font-bold text-ink tabular-nums">
              {focusMin}:00
            </p>
            <p className="text-caption tracking-wider text-ink-soft uppercase">
              Tersisa
            </p>
          </div>
        </div>
        <div className="mt-5 flex h-10 items-center justify-center rounded-lg bg-primary text-body font-semibold text-primary-foreground">
          Jeda
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const { session, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  // Pengguna yang sudah login tidak perlu daftar lagi, jadi semua CTA ajakan membawanya ke dasbor.
  const signupTo = session ? '/app' : '/register'

  return (
    <div className="min-h-dvh bg-background">
      <header
        className="sticky top-0 z-10 border-b border-border bg-card"
        onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
      >
        <div
          className={cn(
            container,
            'flex h-16 items-center justify-between gap-4 lg:h-24',
          )}
        >
          <Link
            to="/"
            aria-label="LUMEN, ke atas"
            className={cn('rounded-md', focusRing)}
          >
            <Logo />
          </Link>
          <nav
            aria-label="Bagian halaman"
            className="hidden items-center gap-8 md:flex"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={cn(
                  'rounded-md text-body font-medium text-ink-soft hover:text-emerald-deep',
                  focusRing,
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              onClick={() => setMenuOpen((o) => !o)}
              className={cn(
                'grid size-11 place-items-center rounded-md text-ink md:hidden',
                focusRing,
              )}
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <Menu aria-hidden="true" className="size-5" />
              )}
            </button>
            {loading ? null : session ? (
              <Button asChild>
                <Link to="/app">Buka Aplikasi</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="hidden sm:inline-flex"
                >
                  <Link to="/login">Masuk</Link>
                </Button>
                <Button asChild>
                  <Link to={signupTo}>Mulai Sekarang</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        {menuOpen && (
          <nav
            id="menu-mobile"
            aria-label="Bagian halaman"
            className="border-t border-border bg-card md:hidden"
          >
            <ul className={cn(container, 'py-2')}>
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex h-11 items-center rounded-md text-body font-medium text-ink-soft hover:text-emerald-deep',
                      focusRing,
                    )}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              {!loading && !session && (
                <li className="sm:hidden">
                  <Link
                    to="/login"
                    className={cn(
                      'flex h-11 items-center rounded-md text-body font-medium text-ink-soft hover:text-emerald-deep',
                      focusRing,
                    )}
                  >
                    Masuk
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>

      <main>
        <section
          className={cn(
            container,
            'grid gap-10 py-12 lg:grid-cols-[1fr_436px] lg:items-center lg:gap-16 lg:py-20',
          )}
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-caption text-emerald-deep ring-1 ring-soft-mint">
              <Sprout aria-hidden="true" className="size-3.5" />
              Pendamping fokus yang tenang
            </span>
            <h1 className="mt-4 text-[2.5rem] leading-[1.1] font-bold sm:text-[3.5rem]">
              Sedikit fokus. Sedikit kemajuan.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              Pecah tujuan besar jadi langkah kecil, dan kerjakan dengan ritmemu
              sendiri. Tanpa alarm mengejutkan, tanpa beban target, dan tanpa
              kewalahan pikiran.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to={signupTo}>
                  Mulai Gratis <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#cara-kerja">
                  <CirclePlay aria-hidden="true" /> Lihat cara kerja
                </a>
              </Button>
            </div>
            <p className="mt-6 flex items-center gap-2 text-caption text-ink-soft">
              <ShieldCheck
                aria-hidden="true"
                className="size-3.5 shrink-0 text-emerald-deep"
              />
              Gratis selamanya untuk fokus pribadi • Nyaman dan ramah perhatian
            </p>
          </div>
          <PreviewCard />
        </section>

        <section
          id="fitur"
          aria-labelledby="fitur-title"
          className="scroll-mt-24 bg-card py-16 lg:py-24"
        >
          <div className={container}>
            <SectionHead
              id="fitur-title"
              icon={Brain}
              label="Arsitektur Lembut"
              title="Dirancang sesuai cara kerja otakmu"
            >
              Aplikasi tugas biasa menciptakan tekanan lewat tenggat waktu merah
              dan jadwal kaku. LUMEN menggantikan stres dengan dorongan yang
              tenang.
            </SectionHead>
            <ul className="mt-12 grid gap-8 md:grid-cols-3">
              {FEATURES.map((f, i) => {
                const [Icon, NoteIcon] = FEATURE_ICONS[i]
                return (
                  <li
                    key={f.title}
                    className="flex flex-col rounded-2xl bg-background p-8 ring-1 ring-border"
                  >
                    <span className="grid size-14 place-items-center rounded-xl bg-mint text-emerald-deep">
                      <Icon aria-hidden="true" className="size-6" />
                    </span>
                    <h3 className="mt-6 text-card-title font-bold">
                      {f.title}
                    </h3>
                    <p className="mt-3 flex-1 text-body leading-relaxed text-ink-soft">
                      {f.body}
                    </p>
                    <p className="mt-6 flex items-center gap-2 border-t border-border pt-4 text-caption font-semibold text-emerald-deep">
                      <NoteIcon aria-hidden="true" className="size-3.5" />
                      {f.note}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        <section
          id="cara-kerja"
          aria-labelledby="cara-kerja-title"
          className="scroll-mt-24 py-16 lg:py-24"
        >
          <div className={container}>
            <SectionHead
              id="cara-kerja-title"
              icon={ArrowDownUp}
              label="Alur 3 Langkah Sederhana"
              title="Cara kerja LUMEN"
            >
              Tiga langkah ringan dari rasa kewalahan menuju tindakan yang
              tenang dan terarah.
            </SectionHead>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className="rounded-2xl bg-card p-8 ring-1 ring-border"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-mint text-card-title font-bold text-emerald-deep">
                    {i + 1}
                  </span>
                  <h3 className="mt-6 text-card-title font-bold">{s.title}</h3>
                  <p className="mt-3 text-body leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="energi-mental"
          aria-labelledby="energi-title"
          className="scroll-mt-24 bg-card py-16 lg:py-24"
        >
          <div className={container}>
            <SectionHead
              id="energi-title"
              icon={BatteryMedium}
              label="Cek Energi Harian"
              title="Bekerja bersama energimu, bukan melawannya"
            >
              Energi mental bisa naik turun setiap hari. Tidak perlu merasa
              bersalah di hari yang berat: LUMEN menyesuaikan langkah mikro dan
              durasi fokusmu.
            </SectionHead>
            <ul className="mt-12 grid gap-8 md:grid-cols-3">
              {ENERGY_MODES.map((m) => {
                const Icon = MODE_ICONS[m.level]
                const featured = m.level === 'medium'
                return (
                  <li
                    key={m.level}
                    className={cn(
                      'flex flex-col rounded-2xl p-8 ring-1',
                      featured
                        ? 'bg-mint ring-soft-mint'
                        : 'bg-background ring-border',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-caption ring-1',
                        featured
                          ? 'bg-primary text-primary-foreground ring-primary'
                          : 'bg-card text-ink-soft ring-border',
                      )}
                    >
                      <Icon aria-hidden="true" className="size-3.5" />
                      {m.badge}
                    </span>
                    <h3 className="mt-5 text-card-title font-bold">
                      {m.title}
                    </h3>
                    <p className="mt-3 flex-1 text-body leading-relaxed text-ink-soft">
                      {m.body}
                    </p>
                    <p
                      className={cn(
                        'mt-6 border-t pt-4 text-caption font-semibold',
                        featured
                          ? 'border-soft-mint text-emerald-deep'
                          : 'border-border text-ink-soft',
                      )}
                    >
                      {m.note}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        <section
          id="tanya-jawab"
          aria-labelledby="tanya-title"
          className="scroll-mt-24 py-16 lg:py-24"
        >
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <SectionHead
              id="tanya-title"
              icon={CircleHelp}
              label="Tanya Jawab"
              title="Pertanyaan yang Sering Diajukan"
            >
              Segala hal yang perlu kamu ketahui tentang LUMEN dan ritme kerja
              yang tenang.
            </SectionHead>
            <div className="mt-12 space-y-4">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl bg-card ring-1 ring-border"
                >
                  <summary
                    className={cn(
                      'flex min-h-14 list-none items-start justify-between gap-4 rounded-2xl p-6 text-card-title font-semibold text-ink [&::-webkit-details-marker]:hidden',
                      focusRing,
                    )}
                  >
                    {f.q}
                    <ChevronDown
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="px-6 pb-6 text-body leading-relaxed text-ink-soft">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="cta-title"
          className={cn(container, 'pb-16 lg:pb-24')}
        >
          <div className="rounded-panel bg-mint px-6 py-14 text-center ring-1 ring-soft-mint sm:px-12">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-card text-emerald-deep">
              <Sprout aria-hidden="true" className="size-6" />
            </span>
            <h2
              id="cta-title"
              className="mx-auto mt-6 max-w-xl text-hero text-ink sm:text-[2rem] sm:leading-10"
            >
              Siap dengan cara yang lebih tenang untuk menyelesaikan hal-hal
              penting?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-body leading-relaxed text-ink-soft sm:text-base">
              Tanpa kartu kredit. Tanpa tekanan. Pilih satu tugas kecil dan
              rasakan ringannya kemajuan bertahap.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to={signupTo}>
                Mulai sesi fokus pertamamu <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <p className="mt-4 text-caption font-semibold text-emerald-deep">
              Gratis selamanya untuk individu • Mulai kapan saja saat kamu siap
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className={cn(container, 'py-10')}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-sm">
              <Logo className="text-card-title" />
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                Pendamping fokus yang tenang, dirancang untuk meredakan rasa
                kewalahan dan merayakan setiap kemajuan kecil.
              </p>
            </div>
            <nav
              aria-label="Tautan footer"
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              {NAV_LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className={cn(
                    'rounded-md text-caption text-ink-soft hover:text-emerald-deep',
                    focusRing,
                  )}
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/app"
                className={cn(
                  'rounded-md text-caption font-semibold text-emerald-deep',
                  focusRing,
                )}
              >
                Buka Aplikasi
              </Link>
            </nav>
          </div>
          <div className="mt-8 flex flex-col justify-between gap-2 border-t border-border pt-6 text-caption text-ink-soft sm:flex-row">
            <p>© 2026 LUMEN. Sedikit fokus. Sedikit kemajuan.</p>
            <p>Dibuat dengan kehangatan untuk kamu yang sedang kewalahan.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
