import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { useAuth } from './auth-context'
import { setPasswordPending } from './password-pending'

type Props = { open: boolean; onOpenChange: (open: boolean) => void; onPasswordSet?: () => void }

export function UpgradeAccountDialog({ open, onOpenChange, onPasswordSet }: Props) {
  const { user } = useAuth()
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  // Supabase sets user.email only after the verification link is clicked; until then only new_email is set.
  const verified = Boolean(user?.email)
  const pending = !verified && Boolean(user?.new_email)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    const { error } = await supabase.auth.updateUser(verified ? { password: value } : { email: value })
    setBusy(false)
    if (error) return toast.error(error.message)
    setValue('')
    if (verified) {
      setPasswordPending(false)
      onPasswordSet?.()
      toast.success('Akun tersimpan. Kamu bisa masuk dengan email dan password ini.')
      onOpenChange(false)
    } else {
      setPasswordPending(true)
      toast('Cek email untuk verifikasi, lalu buka dialog ini lagi lewat tombol "Buat password".')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading text-h3">{verified ? 'Buat password' : 'Simpan datamu dengan email'}</DialogTitle>
          <DialogDescription className="text-body-2">
            {verified
              ? `Email ${user?.email} sudah terverifikasi. Buat password untuk masuk lagi nanti.`
              : pending
                ? `Link verifikasi sudah dikirim ke ${user?.new_email}. Klik link itu dulu, atau kirim ulang ke email lain.`
                : 'Semua tugas dan check-in yang sudah kamu buat sebagai tamu tetap tersimpan.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <label htmlFor="upgrade-field" className="text-body-2 font-semibold">
            {verified ? 'Password baru' : 'Email'}
          </label>
          <Input
            id="upgrade-field"
            type={verified ? 'password' : 'email'}
            autoComplete={verified ? 'new-password' : 'email'}
            required
            minLength={verified ? 6 : undefined}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Memproses…' : verified ? 'Simpan password' : 'Kirim link verifikasi'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
