import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { useCheckin } from '@/hooks/useCheckin'
import { useTimer } from '@/hooks/useTimer'
import { pickBreak, type BreakTip } from '@/lib/breaks'
import { playChime, unlockChime } from '@/lib/chime'
import { todayLocal } from '@/lib/date'
import { DEFAULT_LEVEL, ENERGY_RULES } from '@/lib/energy'
import { canNotify, type Phase } from '@/lib/timer'
import { BreakDialog } from './BreakDialog'
import { FocusSessionContext } from './focus-session'

function notify(title: string, body: string) {
  if (!canNotify()) return
  try {
    new Notification(title, { body })
  } catch {
    // Chrome on Android throws "Illegal constructor" here; the dialog and chime already fired.
  }
}

function notificationNote(): string | null {
  if (typeof Notification === 'undefined') return 'Browser ini tidak mendukung notifikasi. LUMEN tetap membunyikan suara dan membuka layar jeda saat kamu kembali ke tab ini.'
  if (Notification.permission === 'denied') return 'Notifikasi diblokir di browser ini. Suara dan layar jeda tetap muncul.'
  return null
}

/** Lives above every signed-in page so a running timer finishes even when the user leaves /focus. */
export function FocusSessionProvider({ children }: { children: ReactNode }) {
  const checkin = useCheckin(todayLocal())
  const level = checkin.level ?? DEFAULT_LEVEL
  const rules = ENERGY_RULES[level]
  const [tip, setTip] = useState<BreakTip | null>(null)
  const [note, setNote] = useState(notificationNote)

  const timer = useTimer((phase: Phase) => {
    if (phase === 'focus') {
      const next = pickBreak()
      setTip(next)
      playChime()
      notify('Waktunya jeda', next.title)
    } else {
      toast('Jeda selesai, siap fokus lagi?')
      playChime()
      notify('Jeda selesai', 'Siap fokus lagi?')
    }
  })

  function startFocus() {
    unlockChime()
    timer.start('focus', rules.focusMin)
    // Start first: an unanswered permission prompt must not hold the timer back.
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Promise.resolve(Notification.requestPermission())
        .catch(() => undefined)
        .then(() => setNote(notificationNote()))
    }
  }

  return (
    <FocusSessionContext.Provider value={{ checkin, level, rules, timer, note, startFocus }}>
      {children}
      <BreakDialog
        tip={tip}
        breakMin={rules.breakMin}
        onSkip={() => setTip(null)}
        onStartBreak={() => {
          setTip(null)
          timer.start('break', rules.breakMin)
        }}
      />
    </FocusSessionContext.Provider>
  )
}
