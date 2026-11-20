import { expect, test } from 'vitest'
import { cn } from './utils'

test('type tokens merge as font sizes, not colors', () => {
  expect(cn('text-base font-medium', 'text-section')).toBe('font-medium text-section')
  expect(cn('text-card-title', 'text-ink')).toBe('text-card-title text-ink')
})
