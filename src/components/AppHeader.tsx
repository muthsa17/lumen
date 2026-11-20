import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'
import { Link, NavLink } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/features/auth/auth-context'
import { readPasswordPending } from '@/features/auth/password-pending'
import { UpgradeAccountDialog } from '@/features/auth/UpgradeAccountDialog'
import { ENERGY_COPY, ENERGY_ORDER } from '@/features/checkin/energy-copy'
import { useFocusSession } from '@/features/focus/focus-session'
import type { EnergyLevel } from '@/lib/energy'
import { todayLabel } from '@/lib/format'
import { initials } from '@/lib/initials'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'inline-flex h-11 items-center border-b-2 px-1 text-body font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
    isActive
      ? 'border-emerald-deep text-emerald-deep'
      : 'border-transparent text-ink-soft hover:text-ink',
  )

const NAV = [
  { to: '/app', label: 'Dasbor' },
  { to: '/progress', label: 'Progres' },
]

const menuContent = 'z-50 min-w-48 rounded-xl border bg-card p-1 shadow-md'
const menuItem =
  'flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 text-body text-ink outline-none data-[highlighted]:bg-mint data-[highlighted]:text-emerald-deep data-[state=checked]:font-semibold'

export function AppHeader() {
  const { isGuest, user } = useAuth()
  const { level, checkin } = useFocusSession()
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [passwordPending, setPasswordPending] = useState(readPasswordPending)
  const needsPassword = !isGuest && Boolean(user?.email) && passwordPending
  const [confirmOpen, setConfirmOpen] = useState(false)

  const signOut = () => supabase.auth.signOut()
  const EnergyIcon = ENERGY_COPY[level].icon

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 md:min-h-24">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 rounded-md text-section font-bold tracking-wider text-emerald-deep focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <img
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full"
          />
          LUMEN
        </Link>
        <p className="ml-2 hidden border-l pl-4 text-body text-ink-soft lg:block">
          {todayLabel()}
        </p>

        <nav aria-label="Utama" className="ml-4 hidden gap-6 md:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={navClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border bg-mint px-4 text-body font-semibold text-emerald-deep focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label={`Energi Mental: ${ENERGY_COPY[level].label}. Ubah energi hari ini`}
            >
              <EnergyIcon aria-hidden="true" className="size-5" />
              <span className="hidden sm:inline">Energi Mental:</span>{' '}
              {ENERGY_COPY[level].label}
              <ChevronDown aria-hidden="true" className="size-4" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className={menuContent}
              >
                <DropdownMenu.Label className="px-3 py-2 text-caption text-ink-soft">
                  Energi hari ini
                </DropdownMenu.Label>
                <DropdownMenu.RadioGroup
                  value={level}
                  onValueChange={(v) => void checkin.setLevel(v as EnergyLevel)}
                >
                  {[...ENERGY_ORDER].reverse().map((lvl) => (
                    <DropdownMenu.RadioItem
                      key={lvl}
                      value={lvl}
                      className={menuItem}
                    >
                      {ENERGY_COPY[lvl].label}
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger
              aria-label="Menu akun"
              className="grid size-11 cursor-pointer place-items-center rounded-full border bg-mint text-body font-semibold text-emerald-deep focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {initials(user?.user_metadata?.full_name, user?.email)}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className={menuContent}
              >
                {NAV.map((n) => (
                  <DropdownMenu.Item
                    key={n.to}
                    asChild
                    className={cn(menuItem, 'md:hidden')}
                  >
                    <Link to={n.to}>{n.label}</Link>
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Item asChild className={menuItem}>
                  <Link to="/profile">Profil</Link>
                </DropdownMenu.Item>
                {(isGuest || needsPassword) && (
                  <DropdownMenu.Item
                    className={menuItem}
                    onSelect={() => setUpgradeOpen(true)}
                  >
                    {isGuest ? 'Daftarkan email' : 'Buat password'}
                  </DropdownMenu.Item>
                )}
                <DropdownMenu.Item
                  className={menuItem}
                  onSelect={() => (isGuest ? setConfirmOpen(true) : signOut())}
                >
                  Keluar
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <UpgradeAccountDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        onPasswordSet={() => setPasswordPending(false)}
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-card-title">
              Keluar dari mode tamu?
            </DialogTitle>
            <DialogDescription className="text-body">
              Data tamu akan hilang permanen setelah keluar. Daftarkan email
              dulu agar data tersimpan.
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
