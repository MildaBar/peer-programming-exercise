import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import type { Screenings } from '@/database'

export const screeningsFactory = (
  overrides: Partial<Insertable<Screenings>> = {}
): Insertable<Screenings> => ({
  id: 1,
  movieId: 234,
  numberOfTickets: 100,
  numberOfTicketsLeft: 80,
  movieTitle: 'Test movie title',
  movieYear: 1996,
  createdAt: '2023-11-01T08:32:15.182Z',
  ...overrides,
})

export const screeningsMatcher = (
  overrides: Partial<Insertable<Screenings>> = {}
) => ({
  id: expect.any(Number),
  ...screeningsFactory(overrides),
  ...overrides,
})
