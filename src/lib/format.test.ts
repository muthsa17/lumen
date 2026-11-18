import { expect, test } from 'vitest'
import { dayLabel, tomorrowLocal } from './format'

const now = new Date(2026, 10, 30, 23, 30)

test('tomorrowLocal melewati akhir bulan memakai tanggal lokal', () => {
  expect(tomorrowLocal(now)).toBe('2026-12-01')
})

test('dayLabel: Hari ini, Besok, lalu tanggal singkat', () => {
  expect(dayLabel('2026-11-30', now)).toBe('Hari ini')
  expect(dayLabel('2026-12-01', now)).toBe('Besok')
  expect(dayLabel('2026-12-05', now)).toBe('5 Des')
})
