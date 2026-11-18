import { expect, test } from 'vitest'
import { todayLocal } from './date'

test('tes berjalan di zona WIB (vite.config)', () => {
  // without this, the test below passes even when todayLocal uses UTC
  expect(new Date(2026, 10, 13, 3, 0).getTimezoneOffset()).toBe(-420)
})

test('todayLocal memakai tanggal lokal, bukan UTC', () => {
  // 03:00 WIB on the 13th is 20:00 UTC on the 12th; toISOString() would give '-12'
  expect(todayLocal(new Date(2026, 10, 13, 3, 0))).toBe('2026-11-13')
  expect(todayLocal(new Date(2026, 10, 13, 23, 30))).toBe('2026-11-13')
  expect(todayLocal(new Date(2026, 0, 5, 0, 5))).toBe('2026-01-05')
})
