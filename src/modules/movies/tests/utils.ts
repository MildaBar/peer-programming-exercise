import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import type { Movies } from '@/database'

export const movieFactory = (
  overrides: Partial<Insertable<Movies>> = {}
): Insertable<Movies> => ({
  id: 1,
  title: 'Test movie title',
  year: 1996,
  ...overrides,
})

export const movieMatcher = (overrides: Partial<Insertable<Movies>> = {}) => ({
  id: expect.any(Number),
  ...overrides,
  ...movieFactory(overrides),
})
