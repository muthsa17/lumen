import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { ChevronDown, LogOut, Sparkles } from 'lucide-react'
import logoImg from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/features/auth/auth-context'
import { readPasswordPending } from '@/features/auth/password-pending'
import { UpgradeAccountDialog } from '@/features/auth/UpgradeAccountDialog'
import { useFocusSession } from '@/features/focus/focus-session'
import { ENERGY_COPY } from '@/features/checkin/energy-copy'
import type { EnergyLevel } from '@/lib/energy'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function EnergyBatteryIcon({ level }: { level: EnergyLevel | null }) {
  const bars = level === 'high' ? 5 : level === 'low' ? 2 : 3
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0 text-green" aria-hidden="true">
      <path d="M3.75 5H14.58C15.73 5 16.67 5.93 16.67 7.08V12.92C16.67 14.07 15.73 15 14.58 15H3.75C2.6 15 1.67 14.07 1.67 12.92V7.08C1.67 5.93 2.6 5 3.75 5Z" strokeWidth="1.6" stroke="currentColor"/>
      <path d="M18.33 8.33V11.67" strokeWidth="1.6" strokeLinecap="round" stroke="currentColor"/>
      <rect x="3.75" y="7.08" width="1.67" height="5.84" rx="0.5" fill={bars >= 1 ? "currentColor" : "var(--green-light-hover)"}/>
      <rect x="6.25" y="7.08" width="1.67" height="5.84" rx="0.5" fill={bars >= 2 ? "currentColor" : "var(--green-light-hover)"}/>
      <rect x="8.75" y="7.08" width="1.67" height="5.84" rx="0.5" fill={bars >= 3 ? "currentColor" : "var(--green-light-hover)"}/>
      <rect x="11.25" y="7.08" width="1.67" height="5.84" rx="0.5" fill={bars >= 4 ? "currentColor" : "var(--green-light-hover)"}/>
      <rect x="13.75" y="7.08" width="0.83" height="5.84" rx="0.4" fill={bars >= 5 ? "currentColor" : "var(--green-light-hover)"}/>
    </svg>
  )
}

function formatIndonesianDate(d: Date): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch {
    return d.toLocaleDateString()
  }
}

export function AppHeader({ onOpenCheckin }: { onOpenCheckin?: () => void }) {
  const { isGuest, user } = useAuth()
  const { checkin } = useFocusSession()
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [passwordPending, setPasswordPending] = useState(readPasswordPending)
  const needsPassword = !isGuest && Boolean(user?.email) && passwordPending
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const [todayFormatted] = useState(() => formatIndonesianDate(new Date()))
  const signOut = () => supabase.auth.signOut()

  const energyLabel = checkin.level ? ENERGY_COPY[checkin.level].label : 'Sedang'
  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'MC'

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white">
      <div className="mx-auto flex h-[96px] max-w-[1280px] items-center justify-between px-6 sm:px-12 lg:px-16">
        {/* Kiri: Logo LUMEN, tanggal & navigasi */}
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-4 lg:gap-6">
            <Link
              to="/app"
              className="flex items-center gap-2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <img src={logoImg} alt="LUMEN" className="size-[27px] rounded-full object-cover" />
              <span className="font-heading text-[22px] font-bold tracking-[2.2px] text-green uppercase">
                LUMEN
              </span>
            </Link>

            <div className="hidden h-6 w-px bg-border sm:block" />

            <span className="hidden text-body-2 font-medium tracking-[0.1px] text-neutral sm:inline-block">
              {todayFormatted}
            </span>
          </div>

          <nav aria-label="Utama" className="hidden items-center gap-6 md:flex">
            <NavLink
              to="/app"
              end
              className={({ isActive }) =>
                cn(
                  'relative pb-1 font-heading text-body-2 transition-colors',
                  isActive
                    ? 'border-b-2 border-green font-semibold text-green'
                    : 'text-neutral hover:text-neutral-darker',
                )
              }
            >
              Dasbor
            </NavLink>
            <NavLink
              to="/focus"
              className={({ isActive }) =>
                cn(
                  'relative pb-1 font-heading text-body-2 transition-colors',
                  isActive
                    ? 'border-b-2 border-green font-semibold text-green'
                    : 'text-neutral hover:text-neutral-darker',
                )
              }
            >
              Progres
            </NavLink>
            <span className="cursor-default pb-1 font-heading text-body-2 text-neutral/70">
              Pustaka Jeda
            </span>
          </nav>
        </div>

        {/* Kanan: Pil Energi Mental + Profil Dropdown */}
        <div className="flex items-center gap-3 sm:gap-4">
          {onOpenCheckin && (
            <button
              type="button"
              onClick={onOpenCheckin}
              className="group flex h-10 items-center gap-2 rounded-full border border-green-light-hover bg-green-light px-4 py-2 shadow-xs transition-all hover:bg-green-light-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              title="Buka pilihan energi harian"
            >
              <EnergyBatteryIcon level={checkin.level} />
              <span className="font-heading text-body-2 font-medium tracking-[0.1px] text-green">
                Energi Mental: {energyLabel}
              </span>
              <ChevronDown className="size-3.5 text-green transition-transform group-hover:translate-y-0.5" />
            </button>
          )}

          {/* Avatar Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex size-10 items-center justify-center rounded-full border-2 border-green-light-hover bg-green-light font-heading text-body-2 font-semibold text-green shadow-xs transition-all hover:border-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              title="Menu akun"
            >
              {userInitials}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-[16px] border border-border bg-card p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95">
                {(isGuest || needsPassword) && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      setUpgradeOpen(true)
                    }}
                    className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-left text-body-2 font-medium text-neutral-darker transition-colors hover:bg-green-light hover:text-green"
                  >
                    <Sparkles className="size-4 text-yellow" />
                    <span>{isGuest ? 'Daftarkan Email' : 'Buat Password'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    if (isGuest) setConfirmOpen(true)
                    else signOut()
                  }}
                  className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-left text-body-2 font-medium text-danger transition-colors hover:bg-danger/10"
                >
                  <LogOut className="size-4" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
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
            <DialogTitle className="font-heading text-h3 font-bold text-neutral-darker">
              Keluar dari mode tamu?
            </DialogTitle>
            <DialogDescription className="text-body-2 text-muted-foreground">
              Data tugas dan sesi fokus yang sudah kamu buat sebagai tamu akan hilang permanen jika keluar. Daftarkan email kamu terlebih dahulu agar data tetap aman tersimpan.
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
