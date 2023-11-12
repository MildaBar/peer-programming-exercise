import { omit } from 'lodash/fp'
import { parse } from '../schema'
import { movieFactory } from './utils'

it('parses a valid movie data', () => {
  const movies = movieFactory()

  expect(parse(movies)).toEqual(movies)
})

it('throws an error due to empty/missing movie title', () => {
  const movies = movieFactory()
  const movieWithoutTitle = omit('title', movies)

  expect(() => parse(movieWithoutTitle)).toThrow(Error)
})

it('throws an error due to empty/missing movie title', () => {
  const movies = movieFactory()
  const movieWithoutYear = omit('year', movies)

  expect(() => parse(movieWithoutYear)).toThrow(Error)
})
