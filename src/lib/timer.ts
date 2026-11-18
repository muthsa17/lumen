export type Phase = 'focus' | 'break'
export type TimerState = { phase: Phase; endAt: number } | null

export const TIMER_KEY = 'lumen.timer'

export function remainingMs(state: TimerState, now: number): number {
  return state ? Math.max(0, state.endAt - now) : 0
}

/** Parses the stored timer; anything malformed or from an older shape means idle. */
export function loadTimer(raw: string | null): TimerState {
  if (!raw) return null
  try {
    const v = JSON.parse(raw)
    if ((v?.phase === 'focus' || v?.phase === 'break') && typeof v.endAt === 'number') {
      return { phase: v.phase, endAt: v.endAt }
    }
  } catch {
    // corrupt storage falls through to idle
  }
  return null
}

/** Safari on iOS (outside a PWA) has no Notification global at all. */
export function canNotify(): boolean {
  return typeof Notification !== 'undefined' && Notification?.permission === 'granted'
}

/**
 * What a tab should do on each tick. Only the tab that still finds its own endAt in storage
 * fires, so two open /focus tabs never chime twice.
 */
export function tickDecision(local: TimerState, stored: TimerState, now: number): 'idle' | 'running' | 'fire' | 'handled' {
  if (!local) return 'idle'
  if (remainingMs(local, now) > 0) return 'running'
  return stored?.endAt === local.endAt && stored.phase === local.phase ? 'fire' : 'handled'
}
