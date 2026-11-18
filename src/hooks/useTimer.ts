import { useCallback, useEffect, useRef, useState } from 'react'
import { loadTimer, remainingMs, tickDecision, TIMER_KEY, type Phase, type TimerState } from '@/lib/timer'

function readStored(): TimerState {
  try {
    return loadTimer(localStorage.getItem(TIMER_KEY))
  } catch {
    return null
  }
}

// False once a write fails; then this tab is the only owner and must not wait for storage to agree.
let storageOk = true

function writeStored(state: TimerState) {
  try {
    if (state) localStorage.setItem(TIMER_KEY, JSON.stringify(state))
    else localStorage.removeItem(TIMER_KEY)
  } catch {
    storageOk = false
  }
}

export function useTimer(onFinish: (phase: Phase) => void) {
  const [state, setState] = useState<TimerState>(readStored)
  const [now, setNow] = useState(() => Date.now())
  const stateRef = useRef(state)
  const onFinishRef = useRef(onFinish)

  useEffect(() => {
    stateRef.current = state
    onFinishRef.current = onFinish
  })

  useEffect(() => {
    function tick() {
      const t = Date.now()
      setNow(t)
      const local = stateRef.current
      const decision = tickDecision(local, storageOk ? readStored() : local, t)
      if (decision === 'handled') {
        stateRef.current = readStored()
        setState(stateRef.current)
      } else if (decision === 'fire' && local) {
        // Clear storage before notifying so a second tab ticking right after sees "handled".
        writeStored(null)
        stateRef.current = null
        setState(null)
        onFinishRef.current(local.phase)
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  const start = useCallback((phase: Phase, minutes: number) => {
    const next = { phase, endAt: Date.now() + minutes * 60_000 }
    writeStored(next)
    stateRef.current = next
    setState(next)
    setNow(Date.now())
  }, [])

  const stop = useCallback(() => {
    writeStored(null)
    stateRef.current = null
    setState(null)
  }, [])

  return { state, remaining: remainingMs(state, now), start, stop }
}
