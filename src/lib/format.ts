import { todayLocal } from './date'

const shortDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' })

const longDate = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

/** "Sabtu, 21 November 2026" in the local calendar day. */
export function todayLabel(now: Date = new Date()): string {
  return longDate.format(now)
}

export function tomorrowLocal(now: Date = new Date()): string {
  return todayLocal(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))
}

/** "Hari ini", "Besok", or a short Indonesian date for a YYYY-MM-DD string. */
export function dayLabel(date: string, now: Date = new Date()): string {
  if (date === todayLocal(now)) return 'Hari ini'
  if (date === tomorrowLocal(now)) return 'Besok'
  const [y, m, d] = date.split('-').map(Number)
  return shortDate.format(new Date(y, m - 1, d))
}
