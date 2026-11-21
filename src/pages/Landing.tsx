import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  SplitSquareVertical,
  Timer,
  Coffee,
  CheckCircle2,
  Sliders,
  BatteryCharging,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import logoImg from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth-context'
import { supabase } from '@/lib/supabase'

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

const FAQ_ITEMS = [
  {
    q: 'Apa perbedaan LUMEN dengan aplikasi Pomodoro biasa?',
    a: 'Aplikasi Pomodoro biasa memaksakan durasi kaku (misal 25 menit kerja dan 5 menit istirahat) serta sering memakai alarm mengejutkan yang memicu kecemasan. LUMEN menyesuaikan durasi fokus dan jeda secara otomatis dengan energi mental harianmu, memecah tugas besar jadi langkah mikro 5–15 menit, dan menyajikan jeda peregangan sadar tanpa rasa bersalah.',
  },
  {
    q: 'Bagaimana jika saya macet atau belum menyelesaikan langkah saya?',
    a: 'Tidak apa-apa dan tanpa rasa bersalah! LUMEN tidak pernah menghukum keterlambatan. Jika suatu langkah terasa terlalu berat, kamu bisa memecahnya lagi jadi langkah yang lebih kecil atau menggesernya ke besok lewat tombol "Geser ke besok".',
  },
  {
    q: 'Apakah saya harus memiliki diagnosis ADHD untuk memakai LUMEN?',
    a: 'Tidak harus. Meskipun LUMEN dirancang berdasarkan prinsip ramah ADHD dan neurodivergen (arsitektur lembut, pengurangan beban kognitif, dan visual menenangkan), siapa saja yang sering merasa kewalahan oleh tugas menumpuk akan merasakan manfaatnya.',
  },
  {
    q: 'Apakah LUMEN bisa dipakai di ponsel dan tablet?',
    a: 'Ya, LUMEN dirancang sepenuhnya responsif dan berjalan mulus di browser ponsel pintar, tablet, maupun komputer desktop tanpa perlu mengunduh aplikasi terpisah.',
  },
]

export default function Landing() {
  const { session } = useAuth()
  const guest = useGuestStart()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleStart = () => {
    if (session) return
    guest.start()
  }

  const primaryCta = session ? (
    <Button asChild size="lg" className="h-[52px] rounded-[12px] bg-primary px-8 font-heading text-[16px] font-medium text-white shadow-xs hover:bg-green-hover">
      <Link to="/app" className="inline-flex items-center gap-2">
        <span>Buka Tugas Hari Ini</span>
        <ArrowRight className="size-4" />
      </Link>
    </Button>
  ) : (
    <Button
      size="lg"
      onClick={handleStart}
      disabled={guest.busy}
      className="h-[52px] rounded-[12px] bg-primary px-8 font-heading text-[16px] font-medium text-white shadow-xs hover:bg-green-hover"
    >
      <span>{guest.busy ? 'Menyiapkan…' : 'Mulai Gratis'}</span>
      <ArrowRight className="size-4" />
    </Button>
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. NAVBAR (Figma 166:765) */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-[80px] sm:h-[96px] max-w-[1280px] items-center justify-between px-4 sm:px-8">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 rounded-[12px] outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <img src={logoImg} alt="LUMEN Logo" className="size-[27px] rounded-full object-cover" />
            <span className="font-heading text-[22px] font-bold tracking-[2.2px] text-primary uppercase">
              LUMEN
            </span>
          </Link>

          {/* Center: Main Nav Links (Desktop) */}
          <nav aria-label="Navigasi Utama" className="hidden items-center gap-8 md:flex">
            <a href="#fitur" className="rounded-[8px] px-2 py-1 font-heading text-[14px] font-medium text-neutral-active transition-colors hover:text-neutral-darker">
              Fitur
            </a>
            <a href="#cara-kerja" className="rounded-[8px] px-2 py-1 font-heading text-[14px] font-medium text-neutral-active transition-colors hover:text-neutral-darker">
              Cara Kerja
            </a>
            <a href="#energi-mental" className="rounded-[8px] px-2 py-1 font-heading text-[14px] font-medium text-neutral-active transition-colors hover:text-neutral-darker">
              Energi Mental
            </a>
            <a href="#tanya-jawab" className="rounded-[8px] px-2 py-1 font-heading text-[14px] font-medium text-neutral-active transition-colors hover:text-neutral-darker">
              Tanya Jawab
            </a>
          </nav>

          {/* Right: Auth CTAs */}
          <div className="flex items-center gap-3">
            {session ? (
              <Button asChild className="h-[44px] rounded-[12px] bg-primary px-5 font-heading text-[14px] font-medium text-white shadow-xs hover:bg-green-hover">
                <Link to="/app">Masuk ke Aplikasi</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="h-[44px] rounded-[12px] px-4 font-heading text-[14px] font-medium text-neutral-darker hover:bg-neutral-light">
                  <Link to="/login">Masuk</Link>
                </Button>
                <Button
                  onClick={handleStart}
                  disabled={guest.busy}
                  className="h-[44px] rounded-[12px] bg-primary px-5 font-heading text-[14px] font-medium text-white shadow-xs hover:bg-green-hover"
                >
                  {guest.busy ? 'Menyiapkan…' : 'Mulai Sekarang'}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* 2. HERO SECTION (Figma 166:451) */}
        <section aria-labelledby="hero-title" className="mx-auto max-w-[1280px] px-4 py-12 sm:px-8 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Copy & CTAs */}
            <div className="flex flex-col items-start lg:col-span-7">
              {/* ADHD Friendly Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-green-light-active bg-green-light px-3.5 py-1.5 text-primary">
                <Sparkles className="size-3.5 text-primary" />
                <span className="font-heading text-[12px] font-medium tracking-[0.2px]">
                  Alat Fokus Ramah ADHD
                </span>
              </div>

              {/* Title */}
              <h1 id="hero-title" className="mt-6 font-heading text-[38px] sm:text-[54px] lg:text-[56px] font-bold leading-[1.12] tracking-[-1px] text-neutral-darker">
                A little focus. A little progress
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-xl text-[17px] sm:text-[18px] leading-[28px] text-neutral-active">
                Pecah tujuan besar menjadi langkah kecil, dan kerjakan dengan ritmemu sendiri. Tanpa alarm mengejutkan, tanpa beban target, dan tanpa kewalahan pikiran.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {primaryCta}
                <a
                  href="#cara-kerja"
                  className="inline-flex h-[52px] items-center gap-2 rounded-[12px] border border-border bg-card px-6 font-heading text-[16px] font-medium text-neutral-darker drop-shadow-xs transition-colors hover:bg-neutral-light"
                >
                  <PlayCircle className="size-4 text-neutral-active" />
                  <span>Lihat cara kerja</span>
                </a>
              </div>

              {/* Trust Signal */}
              <div className="mt-6 flex items-center gap-2 text-[12px] text-neutral-active">
                <ShieldCheck className="size-4 text-primary" />
                <span>Gratis selamanya untuk fokus pribadi • Nyaman dan ramah perhatian</span>
              </div>
            </div>

            {/* Right Column: Product Preview Card (Figma 166:478) */}
            <div className="lg:col-span-5">
              <div className="rounded-[20px] border border-border bg-card p-6 drop-shadow-xs sm:p-7">
                {/* Window header pill */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-emerald-400" />
                    <span className="font-heading text-[12px] font-medium text-neutral-active">
                      Sesi Fokus LUMEN
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-light px-2.5 py-0.5 text-[12px] font-medium text-primary">
                    <BatteryFull className="size-3 text-primary" />
                    <span>Fokus Tinggi</span>
                  </span>
                </div>

                {/* Task List with Progress */}
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[12px] font-medium">
                      <span className="text-neutral-darker">Tujuan: Publikasi Buletin</span>
                      <span className="text-neutral-active">2 dari 3 langkah</span>
                    </div>
                    {/* Progress track & fill */}
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-green-light-active">
                      <div className="h-full w-2/3 rounded-full bg-primary" />
                    </div>
                  </div>

                  {/* Active Task Row */}
                  <div className="flex items-center justify-between rounded-[20px] border-2 border-green-light-active bg-green-light p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-5 items-center justify-center rounded-full border-2 border-primary bg-card">
                        <span className="size-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="font-heading text-[14px] font-semibold text-neutral-darker">
                          Tulis 3 poin utama
                        </p>
                        <p className="font-heading text-[12px] font-medium text-neutral-active">
                          Draf awal, tanpa revisi
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-neutral-light px-2.5 py-1 font-heading text-[12px] font-medium text-neutral-darker">
                      12 mnt
                    </span>
                  </div>
                </div>

                {/* Mini Adaptive Timer Preview Card */}
                <div className="mt-5 rounded-[20px] border border-border bg-background p-5 text-center">
                  <p className="font-heading text-[12px] font-medium uppercase tracking-[0.2px] text-neutral-active">
                    Pengatur Waktu Fokus Adaptif
                  </p>

                  <div className="relative mx-auto my-3 flex size-[140px] items-center justify-center">
                    <svg className="size-full -rotate-90" viewBox="0 0 140 140">
                      <circle
                        cx="70"
                        cy="70"
                        r="56"
                        stroke="var(--green-light-active)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="70"
                        cy="70"
                        r="56"
                        stroke="var(--primary)"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 56}
                        strokeDashoffset={2 * Math.PI * 56 * 0.25}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <div className="pointer-events-none absolute top-[6px] left-[63px] size-3.5 rounded-full border-2 border-white bg-accent shadow-xs" />
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-heading text-[32px] font-bold text-neutral-darker tabular-nums">
                        25:00
                      </span>
                      <span className="text-[10px] font-medium tracking-[0.5px] uppercase text-neutral-active">
                        TERSISA
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleStart}
                      className="h-[38px] flex-1 rounded-[10px] bg-primary font-heading text-[13px] font-medium text-white"
                    >
                      Mulai Fokus
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-[38px] rounded-[10px] border-border bg-card font-heading text-[13px] font-medium text-neutral-darker"
                    >
                      Atur Ulang
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURES SECTION (Figma 166:533) */}
        <section id="fitur" aria-labelledby="features-title" className="border-t border-border bg-card py-16 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
            {/* Header */}
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-light-active bg-green-light px-3.5 py-1.5 text-primary">
                <Sparkles className="size-3.5 text-primary" />
                <span className="font-heading text-[12px] font-medium tracking-[0.2px]">
                  Arsitektur Lembut
                </span>
              </div>
              <h2 id="features-title" className="mt-4 font-heading text-[28px] sm:text-[36px] font-semibold tracking-[-0.5px] text-neutral-darker">
                Dirancang sesuai cara kerja otak neurodivergen
              </h2>
              <p className="mt-4 text-[16px] sm:text-[18px] leading-[28px] text-neutral-active">
                Aplikasi tugas biasa menciptakan tekanan lewat tenggat waktu merah dan jadwal kaku. LUMEN menggantikan stres dengan dorongan yang tenang.
              </p>
            </div>

            {/* 3 Cards */}
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col justify-between rounded-[20px] border border-border bg-card p-7 drop-shadow-xs transition-transform hover:-translate-y-1">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-[14px] bg-green-light text-primary">
                    <SplitSquareVertical className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-5 font-heading text-[20px] font-semibold text-neutral-darker">
                    Langkah Kecil
                  </h3>
                  <p className="mt-3 text-[15px] leading-[24px] text-neutral-active">
                    Pecah tugas besar yang membingungkan menjadi langkah mikro dengan estimasi waktu jelas (5 hingga 15 menit). Tak ada hal yang terlalu berat jika dibagi bertahap.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-primary">
                  <CheckCircle2 className="size-4" />
                  <span>Bagian kecil 5 hingga 15 mnt</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col justify-between rounded-[20px] border border-border bg-card p-7 drop-shadow-xs transition-transform hover:-translate-y-1">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-[14px] bg-green-light text-primary">
                    <Timer className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-5 font-heading text-[20px] font-semibold text-neutral-darker">
                    Pengatur Waktu Fokus Adaptif
                  </h3>
                  <p className="mt-3 text-[15px] leading-[24px] text-neutral-active">
                    Durasi sesi otomatis menyesuaikan energi mentalmu. Sesi singkat 5 menit saat lelah, atau fokus mendalam 25 menit saat pikiran sedang jernih.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-primary">
                  <Sliders className="size-4" />
                  <span>Menyesuaikan kapasitas harianmu</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col justify-between rounded-[20px] border border-border bg-card p-7 drop-shadow-xs transition-transform hover:-translate-y-1">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-[14px] bg-green-light text-primary">
                    <Coffee className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-5 font-heading text-[20px] font-semibold text-neutral-darker">
                    Jeda
                  </h3>
                  <p className="mt-3 text-[15px] leading-[24px] text-neutral-active">
                    Panduan pemulihan lembut saat fokusmu terpecah. Gerakan bahu santai, tarik napas dalam, dan pengingat minum untuk mengembalikan ketenangan.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-primary">
                  <Sparkles className="size-4" />
                  <span>Istirahat tanpa rasa bersalah</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS (Figma 166:590) */}
        <section id="cara-kerja" aria-labelledby="how-it-works-title" className="border-t border-border bg-neutral-light/40 py-16 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
            {/* Header */}
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-light-active bg-green-light px-3.5 py-1.5 text-primary">
                <Sparkles className="size-3.5 text-primary" />
                <span className="font-heading text-[12px] font-medium tracking-[0.2px]">
                  Alur 3 Langkah Sederhana
                </span>
              </div>
              <h2 id="how-it-works-title" className="mt-4 font-heading text-[28px] sm:text-[36px] font-semibold tracking-[-0.5px] text-neutral-darker">
                Cara kerja LUMEN
              </h2>
              <p className="mt-4 text-[16px] sm:text-[18px] leading-[28px] text-neutral-active">
                Tiga langkah ringan dari rasa kewalahan menuju tindakan yang tenang dan terarah.
              </p>
            </div>

            {/* 3 Numbered Steps */}
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="rounded-[20px] border border-border bg-card p-7 drop-shadow-xs">
                <div className="flex size-11 items-center justify-center rounded-full bg-green-light font-heading text-[18px] font-bold text-primary">
                  1
                </div>
                <h3 className="mt-5 font-heading text-[20px] font-semibold text-neutral-darker">
                  Tambah tugas besar
                </h3>
                <p className="mt-3 text-[15px] leading-[24px] text-neutral-active">
                  Tuliskan apa pun yang terasa membebani pikiranmu ke dalam LUMEN—seperti "Tulis laporan skripsi", "Rapikan meja kerja", atau "Bayar tagihan bulanan".
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-[20px] border border-border bg-card p-7 drop-shadow-xs">
                <div className="flex size-11 items-center justify-center rounded-full bg-green-light font-heading text-[18px] font-bold text-primary">
                  2
                </div>
                <h3 className="mt-5 font-heading text-[20px] font-semibold text-neutral-darker">
                  Pecah jadi langkah kecil
                </h3>
                <p className="mt-3 text-[15px] leading-[24px] text-neutral-active">
                  LUMEN mengurai tugas besar menjadi 3 atau 4 tindakan mikro dengan perkiraan waktu yang wajar agar kamu tahu persis dari mana harus memulai.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-[20px] border border-border bg-card p-7 drop-shadow-xs">
                <div className="flex size-11 items-center justify-center rounded-full bg-green-light font-heading text-[18px] font-bold text-primary">
                  3
                </div>
                <h3 className="mt-5 font-heading text-[20px] font-semibold text-neutral-darker">
                  Mulai sesi fokus
                </h3>
                <p className="mt-3 text-[15px] leading-[24px] text-neutral-active">
                  Aktifkan mode tugas tunggal. Layar menyembunyikan gangguan lain sehingga perhatianmu bisa terfokus pada satu hal yang nyaman dalam satu waktu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. MENTAL ENERGY SECTION (Figma 166:629) */}
        <section id="energi-mental" aria-labelledby="energy-title" className="border-t border-border bg-card py-16 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
            {/* Header */}
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-light-active bg-green-light px-3.5 py-1.5 text-primary">
                <BatteryCharging className="size-3.5 text-primary" />
                <span className="font-heading text-[12px] font-medium tracking-[0.2px]">
                  Cek Energi Harian
                </span>
              </div>
              <h2 id="energy-title" className="mt-4 font-heading text-[28px] sm:text-[36px] font-semibold tracking-[-0.5px] text-neutral-darker">
                Bekerja bersama energimu, bukan melawannya
              </h2>
              <p className="mt-4 text-[16px] sm:text-[18px] leading-[28px] text-neutral-active">
                Energi mental bisa naik turun setiap hari. Alih-alih merasa bersalah di hari yang berat, LUMEN otomatis menyesuaikan langkah mikro dan durasi fokusmu.
              </p>
            </div>

            {/* 3 Energy Level Cards */}
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Level 1: Low */}
              <div className="flex flex-col justify-between rounded-[20px] border border-border bg-card p-7 drop-shadow-xs">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-[14px] bg-yellow-light text-yellow-darker">
                    <BatteryLow className="size-6 text-yellow-darker" />
                  </div>
                  <h3 className="mt-5 font-heading text-[20px] font-semibold text-neutral-darker">
                    Energi Rendah (Mode Tenang)
                  </h3>
                  <p className="mt-1 font-heading text-[14px] font-medium text-yellow-darker">
                    Langkah mikro 5 menit
                  </p>
                  <p className="mt-3 text-[15px] leading-[24px] text-neutral-active">
                    Sangat cocok saat lelah atau sulit memulai. Waktu disesuaikan menjadi 5–8 menit dengan jeda bernapas yang cukup. Tindakan sekecil apa pun tetap dihargai.
                  </p>
                </div>
                <div className="mt-6 rounded-[12px] bg-yellow-light/60 p-3 text-[13px] font-medium text-yellow-darker">
                  Saran: Pemanasan santai & 1 langkah
                </div>
              </div>

              {/* Level 2: Medium (Featured) */}
              <div className="relative flex flex-col justify-between rounded-[20px] border-2 border-primary bg-card p-7 shadow-md">
                <div className="absolute -top-3.5 right-6 rounded-full bg-primary px-3 py-0.5 font-heading text-[11px] font-semibold uppercase tracking-[0.5px] text-white">
                  Paling sering digunakan sehari-hari
                </div>
                <div>
                  <div className="flex size-12 items-center justify-center rounded-[14px] bg-green-light text-primary">
                    <BatteryMedium className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-5 font-heading text-[20px] font-semibold text-neutral-darker">
                    Energi Sedang (Seimbang)
                  </h3>
                  <p className="mt-1 font-heading text-[14px] font-medium text-primary">
                    Fokus teratur 15 menit
                  </p>
                  <p className="mt-3 text-[15px] leading-[24px] text-neutral-active">
                    Kemajuan teratur dan nyaman. Tugas dibagi menjadi sesi 12–15 menit yang terkelola dengan suasana menenangkan agar tidak ragu melangkah.
                  </p>
                </div>
                <div className="mt-6 rounded-[12px] bg-green-light p-3 text-[13px] font-medium text-primary">
                  Saran: 3 langkah harian seimbang
                </div>
              </div>

              {/* Level 3: High */}
              <div className="flex flex-col justify-between rounded-[20px] border border-border bg-card p-7 drop-shadow-xs">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-[14px] bg-green-light text-primary">
                    <BatteryFull className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-5 font-heading text-[20px] font-semibold text-neutral-darker">
                    Energi Tinggi (Hiperfokus)
                  </h3>
                  <p className="mt-1 font-heading text-[14px] font-medium text-primary">
                    Fokus mendalam 25 menit
                  </p>
                  <p className="mt-3 text-[15px] leading-[24px] text-neutral-active">
                    Saat motivasi sedang tinggi dan siap menyelami pekerjaan. Interval 25 menit penuh disertai petunjuk lembut pengingat untuk meregangkan tubuh.
                  </p>
                </div>
                <div className="mt-6 rounded-[12px] bg-green-light/60 p-3 text-[13px] font-medium text-primary">
                  Saran: Sesi mendalam beruntun
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ ACCORDION (Figma 166:680) */}
        <section id="tanya-jawab" aria-labelledby="faq-title" className="border-t border-border bg-neutral-light/40 py-16 sm:py-24">
          <div className="mx-auto max-w-[800px] px-4 sm:px-8">
            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-light-active bg-green-light px-3.5 py-1.5 text-primary">
                <HelpCircle className="size-3.5 text-primary" />
                <span className="font-heading text-[12px] font-medium tracking-[0.2px]">
                  Tanya Jawab
                </span>
              </div>
              <h2 id="faq-title" className="mt-4 font-heading text-[28px] sm:text-[36px] font-semibold tracking-[-0.5px] text-neutral-darker">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="mt-4 text-[16px] sm:text-[18px] leading-[28px] text-neutral-active">
                Segala hal yang perlu kamu ketahui tentang LUMEN dan ritme kerja yang ramah ADHD.
              </p>
            </div>

            {/* Accordion List */}
            <div className="mt-10 space-y-4">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaq === index
                return (
                  <div
                    key={item.q}
                    className="overflow-hidden rounded-[20px] border border-border bg-card drop-shadow-xs transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between p-6 text-left"
                    >
                      <h3 className="font-heading text-[17px] sm:text-[18px] font-semibold text-neutral-darker">
                        {item.q}
                      </h3>
                      <div className="ml-4 flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-light text-neutral-darker">
                        {isOpen ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-border/60 px-6 pt-2 pb-6 text-[15px] sm:text-[16px] leading-[26px] text-neutral-active">
                        {item.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 7. FINAL CTA BANNER (Figma 166:720) */}
        <section aria-labelledby="cta-banner-title" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col items-center rounded-[20px] border-2 border-green-light-active bg-green-light p-8 text-center drop-shadow-xs sm:p-14">
            <div className="flex size-14 items-center justify-center rounded-full bg-card shadow-xs">
              <Sparkles className="size-6 text-primary" />
            </div>
            <h2 id="cta-banner-title" className="mt-5 max-w-2xl font-heading text-[26px] sm:text-[36px] font-bold leading-[1.2] tracking-[-0.5px] text-neutral-darker">
              Siap dengan cara yang lebih tenang untuk menyelesaikan hal-hal penting?
            </h2>
            <p className="mt-4 max-w-xl text-[16px] sm:text-[18px] leading-[28px] text-neutral-active">
              Tanpa kartu kredit. Tanpa tekanan. Pilih satu tugas kecil dan rasakan ringannya kemajuan bertahap.
            </p>
            <div className="mt-8">
              {primaryCta}
            </div>
            <p className="mt-4 text-[12px] font-medium text-neutral-active">
              Gratis selamanya untuk individu • Mulai kapan saja saat kamu siap
            </p>
          </div>
        </section>
      </main>

      {/* 8. FOOTER (Figma 166:740) */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-8 px-4 sm:flex-row sm:px-8">
          {/* Left: Brand info */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logoImg} alt="LUMEN Logo" className="size-7 rounded-full object-cover" />
              <span className="font-heading text-[20px] font-bold tracking-[2px] text-primary uppercase">
                LUMEN
              </span>
            </Link>
            <p className="mt-2.5 max-w-sm text-[14px] leading-[22px] text-neutral-active">
              Pendamping fokus ramah ADHD yang tenang, dirancang untuk meredakan rasa kewalahan dan merayakan setiap kemajuan kecil.
            </p>
          </div>

          {/* Right: Footer Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[14px] font-medium text-neutral-active">
            <a href="#fitur" className="hover:text-neutral-darker">Fitur</a>
            <a href="#cara-kerja" className="hover:text-neutral-darker">Cara Kerja</a>
            <a href="#energi-mental" className="hover:text-neutral-darker">Energi Mental</a>
            <a href="#tanya-jawab" className="hover:text-neutral-darker">Tanya Jawab</a>
            <Link to="/login" className="hover:text-neutral-darker">Masuk</Link>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[1280px] border-t border-border/60 px-4 pt-6 text-center text-[12px] text-neutral-active sm:px-8">
          © 2026 LUMEN • Girls Code Jam 2026, Kelompok 6. Seluruh hak cipta dilindungi.
        </div>
      </footer>
    </div>
  )
}
