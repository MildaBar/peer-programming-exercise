import { z } from 'zod'
import type { Movies } from '@/database'

const schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string(),
  year: z.number(),
})

// schema version for inserting new messages
const insertable = schema.omit({ id: true })

// schema version for updating existing messages
const updateable = insertable.partial()

export const parse = (movie: unknown) => schema.parse(movie)

export const parseInsertable = (movie: unknown) => insertable.parse(movie)

export const parseId = (id: unknown) => schema.shape.id.parse(id)

export const parseUpdateable = (movie: unknown) => updateable.parse(movie)

export const keys: (keyof Movies)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
