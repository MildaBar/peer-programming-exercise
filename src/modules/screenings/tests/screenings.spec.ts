import createTestDatabase from '@tests/utils/createTestDatabase'
import supertest from 'supertest'
import { createFor, selectAllFor } from '@tests/utils/records'
import createApp from '@/app'
import { screeningsFactory } from './utils'
import { movieFactory } from '@/modules/movies/tests/utils'

const db = await createTestDatabase()
const app = createApp(db)
const createScreening = createFor(db, 'screenings')
const createMovies = createFor(db, 'movies')
const selectScreenings = selectAllFor(db, 'screenings')

afterAll(() => db.destroy())

afterEach(async () => {
  try {
    // clearing the tested table after each test
    await db.deleteFrom('movies').execute()
    await db.deleteFrom('screenings').execute()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting rows:', error)
  }
})

describe('GET', () => {
  it('should return all screenings', async () => {
    await createMovies([
      movieFactory({
        id: 234,
        title: 'The movie test title',
        year: 1996,
      }),
    ])
    await createScreening([
      screeningsFactory({
        movieId: 234,
        numberOfTickets: 100,
        numberOfTicketsLeft: 80,
        movieTitle: 'The movie test title',
        movieYear: 1996,
        createdAt: '2023-11-07T08:32:15.182Z',
      }),
    ])

    const { body } = await supertest(app).get('/screenings').expect(200)

    expect(body).toEqual([
      {
        movieId: 234,
        numberOfTickets: 100,
        numberOfTicketsLeft: 80,
        movieTitle: 'The movie test title',
        movieYear: 1996,
        createdAt: '2023-11-07T08:32:15.182Z',
      },
    ])
  })
})

describe('POST', () => {
  it('should return 201 and create a new screenings data', async () => {
    const { body } = await supertest(app)
      .post('/screenings')
      .send(screeningsFactory())
      .expect(201)

    expect(body).toEqual({
      createdAt: '2023-11-01T08:32:15.182Z',
      id: 2,
      movieId: 234,
      movieTitle: 'Test movie title',
      movieYear: 1996,
      numberOfTickets: 100,
      numberOfTicketsLeft: 80,
    })
  })
})

describe('PATCH', () => {
  it('persists changes', async () => {
    const [screeningsInDatabase] = await selectScreenings()
    const { id } = screeningsInDatabase

    await supertest(app)
      .patch('/screenings')
      .send({
        id,
        numberOfTickets: 110,
      })
      .expect(200)
  })
})

describe('REMOVE', () => {
  it('should remove screenings data based on screenings id', async () => {
    const id = 1
    await supertest(app).delete('/screenings').send({ id }).expect(200)
  })
})
