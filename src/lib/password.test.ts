import { describe, expect, it } from 'vitest'
import { checkPassword } from './password'

describe('checkPassword', () => {
  it('treats an empty password as unmet and level 0', () => {
    expect(checkPassword('')).toEqual({ length: false, digit: false, valid: false, level: 0 })
  })

  it('marks a short password with a digit as too short, level 1', () => {
    expect(checkPassword('abc123')).toEqual({ length: false, digit: true, valid: false, level: 1 })
  })
})

describe('checkPassword strength', () => {
  it('is valid at level 2 with 8+ chars and a digit only', () => {
    expect(checkPassword('kucing123')).toMatchObject({ length: true, digit: true, valid: true, level: 2 })
  })

  it('stays level 1 for a long password without a digit', () => {
    expect(checkPassword('kucingkucing')).toMatchObject({ length: true, digit: false, valid: false, level: 1 })
  })

  it('adds a level for mixed case, and another for a symbol', () => {
    expect(checkPassword('Kucing123').level).toBe(3)
    expect(checkPassword('Kucing123!').level).toBe(4)
  })

  it('gives no strength bonus until the basic rules are met', () => {
    expect(checkPassword('Ab!').level).toBe(1)
  })
})
