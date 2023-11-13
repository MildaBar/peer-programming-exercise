import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor, selectAllFor } from '@tests/utils/records'
import buildRepository from '../repository'
import { ticketsFactory } from './utils'
import { movieFactory } from '@/modules/movies/tests/utils'
import { screeningsFactory } from '@/modules/screenings/tests/utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createMovies = createFor(db, 'movies')
const createScreening = createFor(db, 'screenings')
const createTickets = createFor(db, 'tickets')
const selectTickets = selectAllFor(db, 'tickets')

afterAll(() => db.destroy())

afterEach(async () => {
  try {
    await db.deleteFrom('tickets').execute()
    await db.deleteFrom('movies').execute()
    await db.deleteFrom('screenings').execute()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting rows:', error)
  }
})

describe('findByUserId', () => {
  it('should return tickets data based on user id', async () => {
    await createMovies([
      movieFactory({
        id: 3,
        title: 'The movie test title',
        year: 1996,
      }),
    ])

    await createScreening([
      screeningsFactory({
        movieId: 3,
        numberOfTickets: 100,
        numberOfTicketsLeft: 80,
        movieTitle: 'The movie test title',
        movieYear: 1996,
        createdAt: '2023-11-01T08:32:15.182Z',
      }),
    ])

    const ticketsData = await createTickets([
      ticketsFactory({
        userId: 2,
        movieId: 3,
        screeningId: 1,
        numTickets: 100,
        bookingTimestamp: '2023-11-01T08:32:15.182Z',
      }),
    ])

    const tickets = await repository.findByUserId(2)

    expect([tickets]).toEqual(ticketsData)
  })
})

describe('findAll', () => {
  it('should return tickets data', async () => {
    const ticketsInDatabase = await selectTickets()

    const tickets = await repository.findAll()

    expect(tickets).toEqual(ticketsInDatabase)
  })
})
