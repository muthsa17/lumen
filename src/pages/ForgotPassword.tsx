import { useState, type FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthSplitLayout } from '@/features/auth/AuthSplitLayout'
import { supabase } from '@/lib/supabase'

const LINK =
  'rounded font-semibold text-emerald-deep hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    // Hanya batas laju yang ditampilkan; error lain disamarkan supaya keberadaan akun tidak bocor.
    if (error?.code?.includes('rate_limit')) {
      setBusy(false)
      return toast.error(
        'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
      )
    }
    setBusy(false)
    setSent(true)
  }

  return (
    <AuthSplitLayout>
      <div className="my-auto py-10">
        {sent ? (
          <div role="status">
            <h1 className="text-hero font-bold text-ink">Cek emailmu</h1>
            <p className="mt-2 text-body text-ink-soft">
              Jika <strong className="font-semibold">{email}</strong> terdaftar,
              kami sudah mengirim tautan untuk mengatur kata sandi baru.
              Tautannya berlaku sementara, jadi buka secepatnya.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-hero font-bold text-ink">Lupa kata sandi?</h1>
            <p className="mt-1 text-body text-ink-soft">
              Tidak apa-apa. Masukkan emailmu, nanti kami kirim tautan untuk
              mengatur yang baru.
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
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? 'Mengirim…' : 'Kirim tautan'}
              </Button>
            </form>
          </>
        )}
        <p className="mt-6 border-t border-border pt-6 text-center text-body">
          <Link
            to="/login"
            className={`${LINK} inline-flex items-center gap-1.5`}
          >
            <ArrowLeft className="size-4" aria-hidden /> Kembali ke halaman
            masuk
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  )
}
