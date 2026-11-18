import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { todayLocal } from '@/lib/date'
import { DEFAULT_LEVEL, type EnergyLevel } from '@/lib/energy'
import { supabase } from '@/lib/supabase'

export function useCheckin(today: string) {
  const [level, setLevelState] = useState<EnergyLevel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    supabase
      .from('energy_checkins')
      .select('level')
      .eq('date', today)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        setError(error ? error.message : null)
        setLevelState(data?.level ?? null)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [today])

  async function setLevel(next: EnergyLevel) {
    const { error } = await supabase.from('energy_checkins').upsert({ date: today, level: next }, { onConflict: 'user_id,date' })
    if (error) return void toast.error(error.message)
    setLevelState(next)
  }

  return { level, loading, error, setLevel }
}

export function useEnergyLevel(): EnergyLevel {
  return useCheckin(todayLocal()).level ?? DEFAULT_LEVEL
}
