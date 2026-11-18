import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/features/auth/auth-context'
import { readPasswordPending } from '@/features/auth/password-pending'
import { UpgradeAccountDialog } from '@/features/auth/UpgradeAccountDialog'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'inline-flex h-11 items-center rounded-lg px-4 text-body-1 font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
    isActive ? 'bg-green-light text-green-darker' : 'text-neutral-dark hover:bg-muted hover:text-ink',
  )

export function AppHeader() {
  const { isGuest, user } = useAuth()
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [passwordPending, setPasswordPending] = useState(readPasswordPending)
  const needsPassword = !isGuest && Boolean(user?.email) && passwordPending
  const [confirmOpen, setConfirmOpen] = useState(false)

  const signOut = () => supabase.auth.signOut()

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link to="/app" className="rounded-md font-heading text-h2 font-bold text-ink focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
          LUMEN
        </Link>

        <nav aria-label="Utama" className="order-last flex w-full gap-1 sm:order-none sm:w-auto">
          <NavLink to="/app" end className={navClass}>
            Hari ini
          </NavLink>
          <NavLink to="/focus" className={navClass}>
            Fokus
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {(isGuest || needsPassword) && (
            <Button variant="secondary" onClick={() => setUpgradeOpen(true)}>
              {isGuest ? 'Daftarkan email' : 'Buat password'}
            </Button>
          )}
          <Button variant="ghost" onClick={() => (isGuest ? setConfirmOpen(true) : signOut())}>
            Keluar
          </Button>
        </div>
      </div>

      <UpgradeAccountDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} onPasswordSet={() => setPasswordPending(false)} />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-h3">Keluar dari mode tamu?</DialogTitle>
            <DialogDescription className="text-body-2">
              Data tamu akan hilang permanen setelah keluar. Daftarkan email dulu agar data tersimpan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={signOut}>
              Tetap keluar
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false)
                setUpgradeOpen(true)
              }}
            >
              Daftarkan email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
