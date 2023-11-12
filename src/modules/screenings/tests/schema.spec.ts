import { omit } from 'lodash/fp'
import { parse } from '../schema'
import { screeningsFactory } from './utils'

it('parses a valid movie data', () => {
  const screenings = screeningsFactory()

  expect(parse(screenings)).toEqual(screenings)
})

it('throws an error due to empty/missing numberOfTickets', () => {
  const screenings = screeningsFactory()
  const screeningsWithoutTickets = omit('numberOfTickets', screenings)

  expect(() => parse(screeningsWithoutTickets)).toThrow(Error)
})

it('throws an error due to empty/missing movieId', () => {
  const screenings = screeningsFactory()
  const movieWithoutMovieId = omit('movieId', screenings)

  expect(() => parse(movieWithoutMovieId)).toThrow(Error)
})
