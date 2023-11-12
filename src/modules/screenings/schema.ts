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

/*
INSERT INTO screenings (number_of_tickets, number_of_tickets_left, movie_title, movie_year) VALUES (100, 80, 'The Matrix', 1999);
  numberOfTickets: 100,
  numberOfTicketsLeft: 80,
  movieTitle: 'The Matrix',
  movieYear: 1999,
*/

const insertable = schema.omit({ id: true })

const updateable = insertable.partial()

export const parse = (screen: unknown) => schema.parse(screen)

export const parseInsertable = (screen: unknown) => insertable.parse(screen)

export const parseId = (id: unknown) => schema.shape.id.parse(id)

export const parseUpdateable = (screen: unknown) => updateable.parse(screen)

export const keys: (keyof Screenings)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
