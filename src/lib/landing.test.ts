import { describe, expect, it } from 'vitest'
import { ENERGY_RULES } from './energy'
import { ENERGY_MODES, FAQ, NAV_LINKS } from './landing'

describe('ENERGY_MODES', () => {
  it('takes every focus duration from ENERGY_RULES, in low → high order', () => {
    expect(ENERGY_MODES.map((m) => m.level)).toEqual(['low', 'medium', 'high'])
    for (const m of ENERGY_MODES) {
      expect(m.focusMin).toBe(ENERGY_RULES[m.level].focusMin)
      expect(m.title).toContain(`${ENERGY_RULES[m.level].focusMin} menit`)
    }
  })

  it('never states a duration that differs from the rules', () => {
    const allowed = new Set(
      Object.values(ENERGY_RULES).flatMap((r) => [r.focusMin, r.breakMin]),
    )
    for (const m of ENERGY_MODES) {
      for (const n of `${m.title} ${m.body}`.match(/\d+(?= menit)/g) ?? [])
        expect(allowed).toContain(Number(n))
    }
  })
})

describe('NAV_LINKS', () => {
  it('points at section ids that are unique', () => {
    expect(NAV_LINKS.map((l) => l.id)).toEqual([
      'fitur',
      'cara-kerja',
      'energi-mental',
      'tanya-jawab',
    ])
    expect(new Set(NAV_LINKS.map((l) => l.id)).size).toBe(NAV_LINKS.length)
  })
})

describe('FAQ', () => {
  it('has a question and answer for each item', () => {
    expect(FAQ.length).toBeGreaterThanOrEqual(4)
    for (const f of FAQ) expect(f.q && f.a).toBeTruthy()
  })
})
