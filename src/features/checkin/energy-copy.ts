import { BatteryFull, BatteryLow, BatteryMedium, type LucideIcon } from 'lucide-react'
import { ENERGY_RULES, type EnergyLevel } from '@/lib/energy'

export const ENERGY_ORDER: EnergyLevel[] = ['high', 'medium', 'low']

export const ENERGY_COPY: Record<EnergyLevel, { label: string; icon: LucideIcon }> = {
  high: { label: 'Tinggi', icon: BatteryFull },
  medium: { label: 'Sedang', icon: BatteryMedium },
  low: { label: 'Rendah', icon: BatteryLow },
}

export function ruleSummary(level: EnergyLevel): string {
  const r = ENERGY_RULES[level]
  return `Fokus ${r.focusMin} menit, jeda ${r.breakMin} menit, maks ${r.maxTasks} langkah`
}
