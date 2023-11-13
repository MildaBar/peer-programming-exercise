import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import type { Tickets } from '@/database'

export const ticketsFactory = (
  overrides: Partial<Insertable<Tickets>> = {}
): Insertable<Tickets> => ({
  id: 1,
  userId: 3,
  movieId: 2,
  screeningId: 5,
  numTickets: 100,
  bookingTimestamp: '2023-11-01T08:32:15.182Z',
  ...overrides,
})

export const ticketsMatcher = (
  overrides: Partial<Insertable<Tickets>> = {}
) => ({
  id: expect.any(Number),
  ...ticketsFactory(overrides),
  ...overrides,
})
