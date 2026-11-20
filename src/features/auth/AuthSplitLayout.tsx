import type { ReactNode } from 'react'
import { ArrowLeft, Sprout } from 'lucide-react'
import { Link } from 'react-router'

const CHIPS = ['Langkah 5–15 mnt', 'Jeda tenang', 'Bebas alarm keras']

function Chip({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-border bg-card px-3 py-1 text-caption text-emerald-deep">{children}</span>
}

/** Form di kiri, panel mint di kanan (disembunyikan di mobile). Dipakai Register dan Login. */
export function AuthSplitLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-muted/50 p-0 sm:p-6">
      <div className="mx-auto grid min-h-dvh max-w-6xl overflow-hidden bg-card sm:min-h-0 sm:rounded-panel sm:border sm:border-border md:grid-cols-2">
        <main className="flex flex-col px-5 py-8 sm:px-10 sm:py-10">
          <header className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
              <img src="/logo.png" alt="" width={32} height={32} className="size-8 rounded-full" />
              <span className="text-section font-bold tracking-wide text-emerald-deep">LUMEN</span>
            </Link>
            <Link to="/" className="flex items-center gap-1 rounded-md text-caption text-ink-soft hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
              <ArrowLeft className="size-3" aria-hidden /> Kembali ke beranda
            </Link>
          </header>
          {children}
        </main>

        <aside className="hidden flex-col items-center justify-between bg-mint/70 px-10 py-10 md:flex" aria-label="Tentang LUMEN">
          <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-caption text-emerald-deep">
            <Sprout className="size-3" aria-hidden /> Ruang Kerja Tanpa Tekanan
          </span>
          <div className="rounded-panel border border-border bg-card p-3 shadow-sm">
            <img src="/register-illustration.jpg" alt="Seorang mahasiswi bekerja dengan tenang di meja" width={286} height={286} className="size-64 rounded-xl object-cover lg:size-72" />
          </div>
          <div className="text-center">
            <p className="text-section font-bold text-ink">“Sedikit fokus. Sedikit kemajuan.”</p>
            <p className="mx-auto mt-3 max-w-xs text-body text-ink-soft">
              Tanpa beban target beruntun, tanpa alarm mengejutkan, dan tanpa tekanan. Jalani satu langkah mikro setiap saat.
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {CHIPS.map((c) => (
                <li key={c}>
                  <Chip>{c}</Chip>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
