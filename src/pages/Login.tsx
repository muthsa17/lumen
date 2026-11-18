import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StepMark } from '@/components/StepMark'
import { useAuth } from '@/features/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type Mode = 'masuk' | 'daftar'

export default function Login() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('masuk')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && session) return <Navigate to="/app" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    const { data, error } =
      mode === 'masuk'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
    setBusy(false)
    if (error) return toast.error(error.message)
    if (data.session) return navigate('/app')
    // "Confirm email" is on by default in Supabase, so signUp returns no session until the link is clicked.
    toast('Cek email kamu untuk verifikasi, lalu masuk.')
    setMode('masuk')
  }

  async function tryAsGuest() {
    setBusy(true)
    const { error } = await supabase.auth.signInAnonymously()
    setBusy(false)
    if (error) return toast.error(error.message)
    navigate('/app')
  }

  return (
    <div className="min-h-dvh bg-green-light/60">
      <header className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6">
        <Link to="/" className="rounded-md font-heading text-h2 font-bold text-ink focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
          LUMEN
        </Link>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 pb-12 sm:px-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-center md:gap-12 md:pt-8">
        <section className="hidden md:block">
          <StepMark className="mb-6" />
          <p className="font-heading text-[2rem] leading-tight font-bold text-ink">Satu langkah kecil dulu. Sisanya menyusul.</p>
          <p className="mt-4 max-w-md text-body-1 leading-relaxed text-neutral-darker">
            Pecah tugas besar jadi langkah harian, atur fokus sesuai energimu hari ini, dan istirahat sebelum capek.
          </p>
        </section>

        <section className="rounded-panel bg-card p-5 shadow-lg sm:p-8" aria-labelledby="auth-title">
          <h1 id="auth-title" className="text-h1 font-bold">
            {mode === 'masuk' ? 'Masuk ke LUMEN' : 'Buat akun LUMEN'}
          </h1>

          <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="group" aria-label="Pilih mode">
            {(['masuk', 'daftar'] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  'h-11 rounded-md text-body-1 font-semibold text-neutral-dark transition-colors hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                  mode === m && 'bg-card text-ink shadow-sm',
                )}
              >
                {m === 'masuk' ? 'Masuk' : 'Daftar'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-body-2 font-semibold">
                Email
              </label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@kampus.ac.id" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-body-2 font-semibold">
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === 'masuk' ? 'current-password' : 'new-password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mode === 'daftar' && <p className="text-body-3 text-muted-foreground">Minimal 6 karakter.</p>}
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? 'Memproses…' : mode === 'masuk' ? 'Masuk' : 'Buat akun'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-body-3 text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            atau
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="outline" disabled={busy} onClick={tryAsGuest} className="w-full">
            Coba sebagai tamu
          </Button>
          <p className="mt-2 text-center text-body-3 text-muted-foreground">
            Tanpa daftar. Daftarkan email nanti supaya datamu tidak hilang.
          </p>
        </section>
      </main>
    </div>
  )
}
