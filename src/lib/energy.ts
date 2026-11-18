import type { Database } from '@/database.types'

export type EnergyLevel = Database['public']['Enums']['energy_level']

export const ENERGY_RULES: Record<EnergyLevel, { focusMin: number; breakMin: number; maxTasks: number }> = {
  high: { focusMin: 50, breakMin: 10, maxTasks: 6 },
  medium: { focusMin: 25, breakMin: 5, maxTasks: 4 },
  low: { focusMin: 15, breakMin: 5, maxTasks: 2 },
}

export const DEFAULT_LEVEL: EnergyLevel = 'medium'

/** Done items still count toward the limit, so checking one off never pulls a new task into focus. */
export function splitToday<T extends { planned_date: string; position: number }>(
  items: T[],
  today: string,
  limit: number,
): { focus: T[]; later: T[] } {
  const todays = items.filter((i) => i.planned_date === today).sort((a, b) => a.position - b.position)
  return { focus: todays.slice(0, limit), later: todays.slice(limit) }
}
