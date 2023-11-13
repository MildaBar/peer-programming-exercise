import createTestDatabase from '@tests/utils/createTestDatabase'
import supertest from 'supertest'
import { createFor } from '@tests/utils/records'
import createApp from '@/app'
import { ticketsFactory } from './utils'
import { movieFactory } from '@/modules/movies/tests/utils'
import { screeningsFactory } from '@/modules/screenings/tests/utils'

const db = await createTestDatabase()
const app = createApp(db)
const createScreening = createFor(db, 'screenings')
const createMovies = createFor(db, 'movies')
const createTickets = createFor(db, 'tickets')

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

describe('GET', () => {
  it('should return all tickets', async () => {
    await createMovies([
      movieFactory({
        id: 2,
        title: 'The movie test title',
        year: 1996,
      }),
    ])

    await createScreening([
      screeningsFactory({
        movieId: 2,
        numberOfTickets: 100,
        numberOfTicketsLeft: 80,
        movieTitle: 'The movie test title',
        movieYear: 1996,
        createdAt: '2023-11-01T08:32:15.182Z',
      }),
    ])

    const ticketsData = await createTickets([
      ticketsFactory({
        userId: 1,
        movieId: 2,
        screeningId: 1,
        numTickets: 100,
        bookingTimestamp: '2023-11-01T08:32:15.182Z',
      }),
    ])

    const { body } = await supertest(app).get('/tickets').expect(200)

    expect(body).toEqual(ticketsData)
  })
})

describe('POST', () => {
  it('should return 201 and create new tickets data', async () => {
    await createMovies([
      movieFactory({
        id: 3,
        title: 'The movie test title',
        year: 1996,
      }),
    ])

    const { body } = await supertest(app)
      .post('/tickets')
      .send({
        userId: 2,
        movieId: 3,
        screeningId: 1,
        numTickets: 3,
      })
      .expect(201)

    expect(body).toEqual({
      message: 'Booking successful!',
    })
  })
})
