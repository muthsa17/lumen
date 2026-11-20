import { useState, type FormEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { Link, Navigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { AuthSplitLayout } from '@/features/auth/AuthSplitLayout'
import { useAuth } from '@/features/auth/auth-context'
import { PasswordField } from '@/features/auth/PasswordField'
import { PasswordRules } from '@/features/auth/PasswordRules'
import { checkPassword } from '@/lib/password'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

// Pesan bawaan Supabase berbahasa Inggris; kode yang dikenal dipetakan, sisanya jatuh ke kalimat umum.
const SIGNUP_ERRORS: Record<string, string> = {
  user_already_exists: 'Email ini sudah terdaftar. Coba masuk saja.',
  weak_password: 'Kata sandi terlalu mudah ditebak. Coba tambah karakter lain.',
  over_email_send_rate_limit:
    'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
  over_request_rate_limit:
    'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
}

const STRENGTH_LABEL = [
  '',
  'Belum cukup',
  'Kekuatan cukup',
  'Kuat',
  'Sangat kuat',
]

export default function Register() {
  const { session, isGuest, loading } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const pw = checkPassword(password)
  // Baru ditegur setelah panjangnya menyamai kata sandi, supaya tidak menegur di tengah mengetik.
  const mismatch =
    confirm !== password &&
    (submitted || (confirm !== '' && confirm.length >= password.length))
  const agreeError = submitted && !agreed

  if (!loading && session && !isGuest && !sent)
    return <Navigate to="/app" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (!fullName.trim() || !pw.valid || password !== confirm || !agreed) return
    setBusy(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName.trim() } },
    })
    setBusy(false)
    if (error)
      return toast.error(
        SIGNUP_ERRORS[error.code ?? ''] ??
          'Pendaftaran belum berhasil. Coba lagi sebentar lagi.',
      )
    // "Confirm email" menyala secara default, jadi tanpa session pengguna harus klik tautan dulu.
    if (!data.session) setSent(true)
  }

  if (sent) {
    return (
      <AuthSplitLayout>
        <div className="my-auto py-10" role="status">
          <h1 className="text-hero font-bold text-ink">Cek emailmu</h1>
          <p className="mt-2 text-body text-ink-soft">
            Kami mengirim tautan verifikasi ke{' '}
            <strong className="font-semibold">{email}</strong>. Klik tautannya,
            lalu masuk.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link to="/login">Ke halaman masuk</Link>
          </Button>
        </div>
      </AuthSplitLayout>
    )
  }

  return (
    <AuthSplitLayout>
      <div className="mt-10">
        <h1 className="text-hero font-bold text-ink">Buat akunmu</h1>
        <p className="mt-1 text-body text-ink-soft">
          Mulai bekerja dengan ritmemu sendiri.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="full-name" className="text-body font-medium">
              Nama lengkap
            </label>
            <Input
              id="full-name"
              autoComplete="name"
              required
              pattern=".*\S.*"
              title="Isi nama lengkapmu"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-body font-medium">
                Kata sandi
              </label>
              <span
                aria-live="polite"
                className="text-caption font-medium text-emerald-deep"
              >
                {STRENGTH_LABEL[pw.level]}
              </span>
            </div>
            <PasswordField
              id="password"
              autoComplete="new-password"
              required
              aria-invalid={submitted && !pw.valid}
              aria-describedby="password-rules"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-2" aria-hidden>
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className={cn(
                    'h-1 flex-1 rounded-full bg-border',
                    pw.level >= n && 'bg-emerald-deep',
                  )}
                />
              ))}
            </div>
            {submitted && !pw.valid && (
              <p role="alert" className="text-caption text-amber-900">
                Kata sandi belum memenuhi syarat di bawah ini.
              </p>
            )}
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

          <div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                aria-invalid={agreeError}
                aria-describedby={agreeError ? 'agree-error' : undefined}
                className="mt-0.5"
              />
              <label htmlFor="agree" className="text-body text-ink-soft">
                Saya menyetujui{' '}
                <span className="font-medium text-ink">Ketentuan Layanan</span>{' '}
                dan{' '}
                <span className="font-medium text-ink">Kebijakan Privasi</span>
              </label>
            </div>
            {agreeError && (
              <p
                id="agree-error"
                role="alert"
                className="mt-1.5 text-caption text-amber-900"
              >
                Centang dulu persetujuanmu untuk lanjut.
              </p>
            )}
          </div>

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Memproses…' : 'Buat Akun'}
          </Button>
        </form>

        <p className="mt-6 border-t border-border pt-6 text-center text-body text-ink-soft">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="rounded font-semibold text-emerald-deep hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Masuk
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  )
}
