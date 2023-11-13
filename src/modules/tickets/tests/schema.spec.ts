import { omit } from 'lodash/fp'
import { parse } from '../schema'
import { ticketsFactory } from './utils'

it('parses a valid tickets data', () => {
  const tickets = ticketsFactory()

  expect(parse(tickets)).toEqual(tickets)
})

it('throws an error due to empty/missing tickets data (numTickets)', () => {
  const tickets = ticketsFactory()
  const ticketsWithoutNumTickets = omit('numTickets', tickets)

  expect(() => parse(ticketsWithoutNumTickets)).toThrow(Error)
})
