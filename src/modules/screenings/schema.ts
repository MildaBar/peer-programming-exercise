import { z } from 'zod'
import type { Screenings } from '@/database'

const schema = z.object({
  id: z.coerce.number().int().positive(),
  movieId: z.number(),
  numberOfTickets: z.number(),
  numberOfTicketsLeft: z.number(),
  movieTitle: z.string(),
  movieYear: z.number(),
  createdAt: z.string(),
})

const insertable = schema.omit({ id: true })

const updateable = insertable.partial()

export const parse = (screen: unknown) => schema.parse(screen)

export const parseInsertable = (screen: unknown) => insertable.parse(screen)

export const parseId = (id: unknown) => schema.shape.id.parse(id)

export const parseUpdateable = (screen: unknown) => updateable.parse(screen)

export const keys: (keyof Screenings)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
