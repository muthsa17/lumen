import { expect, test, vi } from 'vitest'
import { canNotify, loadTimer, remainingMs, tickDecision } from './timer'

test('remainingMs tidak pernah negatif', () => {
  expect(remainingMs({ phase: 'focus', endAt: 1_000 }, 400)).toBe(600)
  expect(remainingMs({ phase: 'focus', endAt: 1_000 }, 5_000)).toBe(0)
  expect(remainingMs(null, 5_000)).toBe(0)
})

test('loadTimer menolak data rusak', () => {
  expect(loadTimer(null)).toBeNull()
  expect(loadTimer('{bukan json')).toBeNull()
  expect(loadTimer('{"phase":"nap","endAt":1}')).toBeNull()
  expect(loadTimer('{"phase":"focus","endAt":"1"}')).toBeNull()
  expect(loadTimer('{"phase":"break","endAt":123}')).toEqual({ phase: 'break', endAt: 123 })
})

test('canNotify false jika Notification tidak ada atau belum granted', () => {
  vi.stubGlobal('Notification', undefined)
  expect(canNotify()).toBe(false)
  vi.stubGlobal('Notification', { permission: 'denied' })
  expect(canNotify()).toBe(false)
  vi.stubGlobal('Notification', { permission: 'granted' })
  expect(canNotify()).toBe(true)
  vi.unstubAllGlobals()
})

test('tickDecision: idle, running, fire sekali, dan tab lain sudah menangani', () => {
  const t = { phase: 'focus' as const, endAt: 1_000 }
  expect(tickDecision(null, null, 2_000)).toBe('idle')
  expect(tickDecision(t, t, 500)).toBe('running')
  expect(tickDecision(t, t, 1_000)).toBe('fire')
  // another tab already removed the key
  expect(tickDecision(t, null, 1_500)).toBe('handled')
  // another tab already started the next phase
  expect(tickDecision(t, { phase: 'break', endAt: 9_000 }, 1_500)).toBe('handled')
})
