import { createContext, useContext } from 'react'
import type { useCheckin } from '@/hooks/useCheckin'
import type { useTimer } from '@/hooks/useTimer'
import type { ENERGY_RULES, EnergyLevel } from '@/lib/energy'

export type FocusSession = {
  checkin: ReturnType<typeof useCheckin>
  level: EnergyLevel
  rules: (typeof ENERGY_RULES)[EnergyLevel]
  timer: ReturnType<typeof useTimer>
  note: string | null
  startFocus: () => void
}

export const FocusSessionContext = createContext<FocusSession | null>(null)

export function useFocusSession(): FocusSession {
  const ctx = useContext(FocusSessionContext)
  if (!ctx) throw new Error('useFocusSession must be used inside FocusSessionProvider')
  return ctx
}
