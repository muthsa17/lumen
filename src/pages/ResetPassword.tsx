import { useState, type FormEvent } from 'react'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AuthSplitLayout } from '@/features/auth/AuthSplitLayout'
import { useAuth } from '@/features/auth/auth-context'
import { PasswordField } from '@/features/auth/PasswordField'
import { PasswordRules } from '@/features/auth/PasswordRules'
import { checkPassword } from '@/lib/password'
import { resetPasswordError } from '@/lib/recovery'
import { supabase } from '@/lib/supabase'

const LINK =
  'rounded font-semibold text-emerald-deep hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'

export default function ResetPassword() {
  // AuthProvider baru selesai loading setelah klien Supabase menukar token di URL, jadi
  // "loading selesai tanpa session" berarti tautan kedaluwarsa atau tidak valid.
  const { session, isGuest, loading } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)

  const pw = checkPassword(password)
  const mismatch =
    confirm !== password &&
    (submitted || (confirm !== '' && confirm.length >= password.length))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (!pw.valid || password !== confirm) return
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) return toast.error(resetPasswordError(error.code))
    navigate('/app', { replace: true })
  }

  const back = (
    <p className="mt-6 border-t border-border pt-6 text-center text-body">
      <Link to="/login" className={`${LINK} inline-flex items-center gap-1.5`}>
        <ArrowLeft className="size-4" aria-hidden /> Kembali ke halaman masuk
      </Link>
    </p>
  )

  if (loading) {
    return (
      <AuthSplitLayout>
        <p className="my-auto py-10 text-body text-ink-soft" role="status">
          Memeriksa tautanmu…
        </p>
      </AuthSplitLayout>
    )
  }

  // Tamu anonim bukan sesi pemulihan: updateUser tanpa email merusak alur upgrade akun.
  if (!session || isGuest) {
    return (
      <AuthSplitLayout>
        <div className="my-auto py-10" role="status">
          <h1 className="text-hero font-bold text-ink">
            Tautannya sudah kedaluwarsa
          </h1>
          <p className="mt-2 text-body text-ink-soft">
            Tidak apa-apa, minta tautan baru saja.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link to="/forgot-password">Minta tautan baru</Link>
          </Button>
          {back}
        </div>
      </AuthSplitLayout>
    )
  }

  return (
    <AuthSplitLayout>
      <div className="my-auto py-10">
        <h1 className="text-hero font-bold text-ink">Atur kata sandi baru</h1>
        <p className="mt-1 text-body text-ink-soft">
          Pilih kata sandi yang mudah kamu ingat, tapi sulit ditebak orang lain.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-body font-medium">
              Kata sandi baru
            </label>
            <PasswordField
              id="password"
              autoComplete="new-password"
              required
              aria-invalid={submitted && !pw.valid}
              aria-describedby="password-rules"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordRules id="password-rules" pw={pw} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="confirm" className="text-body font-medium">
              Konfirmasi kata sandi
            </label>
            <PasswordField
              id="confirm"
              label="konfirmasi kata sandi"
              autoComplete="new-password"
              required
              aria-invalid={mismatch}
              aria-describedby={mismatch ? 'confirm-error' : undefined}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {mismatch && (
              <p
                id="confirm-error"
                role="alert"
                className="flex items-center gap-1.5 text-caption text-amber-900"
              >
                <AlertCircle className="size-3" aria-hidden /> Kata sandi belum
                cocok. Coba periksa lagi.
              </p>
            )}
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Menyimpan…' : 'Simpan kata sandi'}
          </Button>
        </form>
        {back}
      </div>
    </AuthSplitLayout>
  )
}
