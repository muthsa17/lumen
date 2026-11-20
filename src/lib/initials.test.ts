import { expect, test } from 'vitest'
import { initials } from './initials'

test('memakai huruf awal dua kata pertama full_name', () => {
  expect(initials('muthia sari wulandari', 'a@b.id')).toBe('MS')
})

test('satu kata menghasilkan satu huruf', () => {
  expect(initials('  budi ', 'a@b.id')).toBe('B')
})

test('tanpa nama, jatuh ke huruf pertama email', () => {
  expect(initials(undefined, 'rina@b.id')).toBe('R')
  expect(initials('   ', 'rina@b.id')).toBe('R')
})

test('tamu tanpa nama dan email menjadi "T"', () => {
  expect(initials(undefined, undefined)).toBe('T')
  expect(initials('', '')).toBe('T')
})
