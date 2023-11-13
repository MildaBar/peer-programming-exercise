/* eslint-disable no-console */
import { Database } from '@/database'
import buildMoviesRepository from '@/modules/movies/repository'
import createDatabase from '@/database/index'

require('dotenv').config()

const DATABASE = process.env.DATABASE_URL

if (!DATABASE) {
  throw new Error('No DATABASE_URL provided in the environment variables')
}

const DB = createDatabase(DATABASE)

export async function screeningsData(db: Database, movieTitle: string) {
  const moviesRepository = buildMoviesRepository(db)
  const movieId = await moviesRepository.findIdByMovieTitle(movieTitle)

  const createdAt = new Date().toISOString()

  return [movieId, createdAt]
}

export async function addScreenings(
  db: Database,
  numberOfTickets: number,
  numberOfTicketsLeft: number,
  movieTitle: string,
  movieYear: number
) {
  const result = await screeningsData(db, movieTitle)

  const [movieId, createdAt] = result

  if (typeof movieId !== 'number') {
    throw new Error('Invalid movie ID')
  }

  if (typeof createdAt !== 'string') {
    throw new Error('Invalid createdAt value')
  }

  const records = {
    movieId,
    numberOfTickets,
    numberOfTicketsLeft,
    movieTitle,
    movieYear,
    createdAt,
  }

  return db.insertInto('screenings').values(records).returningAll().execute()
}

addScreenings(DB, 100, 80, 'The Matrix', 1999)
  // eslint-disable-next-line no-console
  .then(() => console.log('Data inserted successfully.'))
  // eslint-disable-next-line no-console
  .catch((error) => console.error('Error inserting data:', error))
