import { z } from 'zod'
import type { Tickets } from '@/database'

const schema = z.object({
  id: z.coerce.number().int().positive(),
  userId: z.number(),
  movieId: z.number(),
  screeningId: z.number(),
  numTickets: z.number(),
  bookingTimestamp: z.string(),
})

const insertable = schema.omit({ id: true })
const updateable = insertable.partial()

export const parse = (ticket: unknown) => schema.parse(ticket)
export const parseInsertable = (ticket: unknown) => insertable.parse(ticket)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseUpdateable = (ticket: unknown) => updateable.parse(ticket)

export const keys: (keyof Tickets)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
