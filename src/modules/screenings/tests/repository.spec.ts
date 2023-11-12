import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor, selectAllFor } from '@tests/utils/records'
import buildRepository from '../repository'
import { screeningsMatcher } from './utils'
import { movieFactory } from '@/modules/movies/tests/utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
// const createScreening = createFor(db, 'screenings')
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

describe('create', () => {
  it('should create a screening', async () => {
    await createMovies([
      movieFactory({
        id: 236,
        title: 'The movie test title',
        year: 1996,
      }),
    ])

    const createdScreening = await repository.create({
      movieId: 236,
      numberOfTickets: 100,
      numberOfTicketsLeft: 80,
      movieTitle: 'The movie test title',
      movieYear: 1996,
      createdAt: '2023-11-01T08:32:15.182Z',
    })

    expect(createdScreening).toEqual({
      id: expect.any(Number),
      movieId: 236,
      numberOfTickets: 100,
      numberOfTicketsLeft: 80,
      movieTitle: 'The movie test title',
      movieYear: 1996,
      createdAt: '2023-11-01T08:32:15.182Z',
    })

    const screeningsInDatabase = await selectScreenings()

    expect(screeningsInDatabase).toEqual([createdScreening])
  })
})

describe('findAll', () => {
  it('should return existing screeenigs data', async () => {
    const screeningsInDatabase = await selectScreenings()

    const screenings = await repository.findAll()

    expect(screenings).toEqual(screeningsInDatabase)
  })
})

describe('update', () => {
  it('should update the screenings data', async () => {
    const [screeningsInDatabase] = await selectScreenings()

    const updateScreeningsData = await repository.update(
      screeningsInDatabase.id,
      {
        numberOfTickets: 110,
      }
    )

    expect(updateScreeningsData).toMatchObject(
      screeningsMatcher({
        id: screeningsInDatabase.id,
        movieId: 236,
        numberOfTickets: 110,
        numberOfTicketsLeft: 80,
        movieTitle: 'The movie test title',
        movieYear: 1996,
        createdAt: '2023-11-01T08:32:15.182Z',
      })
    )
  })
})

describe('remove', () => {
  it('should remove screenings data by id', async () => {
    const [screeningsInDatabase] = await selectScreenings()

    const removeScreenings = await repository.remove(screeningsInDatabase.id)

    expect(removeScreenings).toEqual(
      screeningsMatcher({
        id: screeningsInDatabase.id,
        movieId: 236,
        numberOfTickets: 110,
        numberOfTicketsLeft: 80,
        movieTitle: 'The movie test title',
        movieYear: 1996,
        createdAt: '2023-11-01T08:32:15.182Z',
      })
    )
  })
})
