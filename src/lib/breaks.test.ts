import { expect, test } from 'vitest'
import { BREAKS, pickBreak } from './breaks'

test('BREAKS berisi 6-8 tip lengkap', () => {
  expect(BREAKS.length).toBeGreaterThanOrEqual(6)
  expect(BREAKS.length).toBeLessThanOrEqual(8)
  BREAKS.forEach((b) => {
    expect(b.title).toBeTruthy()
    expect(b.desc).toBeTruthy()
  })
})

test('pickBreak memakai rand', () => {
  expect(pickBreak(() => 0)).toBe(BREAKS[0])
  expect(pickBreak(() => 0.9999)).toBe(BREAKS[BREAKS.length - 1])
})
