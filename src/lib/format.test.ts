import { expect, test } from 'vitest'
import { dayLabel, todayLabel, tomorrowLocal } from './format'

const now = new Date(2026, 10, 30, 23, 30)

test('tomorrowLocal melewati akhir bulan memakai tanggal lokal', () => {
  expect(tomorrowLocal(now)).toBe('2026-12-01')
})

test('dayLabel: Hari ini, Besok, lalu tanggal singkat', () => {
  expect(dayLabel('2026-11-30', now)).toBe('Hari ini')
  expect(dayLabel('2026-12-01', now)).toBe('Besok')
  expect(dayLabel('2026-12-05', now)).toBe('5 Des')
})

test('todayLabel: hari dan tanggal lengkap memakai tanggal lokal', () => {
  // 03:00 WIB tanggal 21 adalah 20:00 UTC tanggal 20; hasilnya harus tetap tanggal 21
  expect(todayLabel(new Date(2026, 10, 21, 3, 0))).toBe('Sabtu, 21 November 2026')
})
