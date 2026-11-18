import { expect, test } from 'vitest'
import { DEFAULT_LEVEL, ENERGY_RULES, splitToday } from './energy'

test('aturan energi sesuai spec §4.1', () => {
  expect(ENERGY_RULES.high).toEqual({ focusMin: 50, breakMin: 10, maxTasks: 6 })
  expect(ENERGY_RULES.medium).toEqual({ focusMin: 25, breakMin: 5, maxTasks: 4 })
  expect(ENERGY_RULES.low).toEqual({ focusMin: 15, breakMin: 5, maxTasks: 2 })
  expect(DEFAULT_LEVEL).toBe('medium')
})

const mk = (id: string, planned_date: string, position: number) => ({ id, planned_date, position })

test('splitToday: hanya hari ini, urut position, N teratas ke focus', () => {
  const items = [mk('c', '2026-11-13', 2), mk('a', '2026-11-13', 0), mk('x', '2026-11-14', 0), mk('b', '2026-11-13', 1)]
  const r = splitToday(items, '2026-11-13', 2)
  expect(r.focus.map((i) => i.id)).toEqual(['a', 'b'])
  expect(r.later.map((i) => i.id)).toEqual(['c'])
})

test('splitToday: limit lebih besar dari jumlah, later kosong', () => {
  expect(splitToday([mk('a', '2026-11-13', 0)], '2026-11-13', 4).later).toEqual([])
})
