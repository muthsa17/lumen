import { useState, type FormEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { AuthSplitLayout } from '@/features/auth/AuthSplitLayout'
import { useAuth } from '@/features/auth/auth-context'
import { PasswordField } from '@/features/auth/PasswordField'
import { setRemember } from '@/lib/auth-storage'
import { supabase } from '@/lib/supabase'

const LINK =
  'rounded font-semibold text-emerald-deep hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'

export default function Login() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRememberState] = useState(true)
  const [failed, setFailed] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!loading && session) return <Navigate to="/app" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setFailed(false)
    setRemember(remember)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setBusy(false)
    if (error) {
      if (error.code === 'invalid_credentials') return setFailed(true)
      return toast.error('Belum bisa masuk saat ini. Coba lagi sebentar lagi.')
    }
    navigate('/app')
  }

  async function tryAsGuest() {
    setBusy(true)
    setRemember(true)
    const { error } = await supabase.auth.signInAnonymously()
    setBusy(false)
    if (error)
      return toast.error(
        'Mode tamu belum bisa dibuka. Coba lagi sebentar lagi.',
      )
    navigate('/app')
  }

  return (
    <AuthSplitLayout blurb="Selamat datang kembali. Tanpa rasa bersalah karena sempat beristirahat. Ruang fokusmu selalu tenang dan siap saat kamu siap.">
      <div className="mt-10">
        <h1 className="text-hero font-bold text-ink">Selamat datang kembali</h1>
        <p className="mt-1 text-body text-ink-soft">
          Siap untuk sedikit fokus hari ini?
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-body font-medium">
              Alamat email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@kampus.ac.id"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-body font-medium">
              Kata sandi
            </label>
            <PasswordField
              id="password"
              autoComplete="current-password"
              required
              aria-invalid={failed}
              aria-describedby={failed ? 'login-error' : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {failed && (
              <p
                id="login-error"
                role="alert"
                className="flex items-center gap-1.5 text-caption text-amber-900"
              >
                <AlertCircle className="size-3" aria-hidden /> Email atau kata
                sandi tidak cocok. Tarik napas dan coba lagi.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRememberState(v === true)}
              />
              <label htmlFor="remember" className="text-body text-ink-soft">
                Ingat saya
              </label>
            </div>
            <Link to="/forgot-password" className={`${LINK} text-caption`}>
              Lupa kata sandi?
            </Link>
          </div>

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Memproses…' : 'Masuk'}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-caption text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          atau
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={tryAsGuest}
          className="w-full"
        >
          Coba dulu tanpa akun
        </Button>

        <p className="mt-6 border-t border-border pt-6 text-center text-body text-ink-soft">
          Belum punya akun?{' '}
          <Link to="/register" className={LINK}>
            Buat akun
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  )
}
