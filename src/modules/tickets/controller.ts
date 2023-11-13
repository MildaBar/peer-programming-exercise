import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'
import buildScreeningsRepository from '@/modules/screenings/repository'

export default (db: Database) => {
  const tickets = buildRespository(db)
  const screenings = buildScreeningsRepository(db)
  const router = Router()

  router
    .route('/')
    .get(
      jsonRoute(async (req, res) => {
        try {
          const allTicketsData = await tickets.findAll()

          if (!allTicketsData) {
            return res
              .status(StatusCodes.NOT_FOUND)
              .json({ error: 'Tickets not found.' })
          }

          return res.status(StatusCodes.OK).json(allTicketsData)
        } catch (error) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
        }
      })
    )
    .post(
      jsonRoute(async (req, res) => {
        try {
          const { userId, movieId, screeningId, numTickets } = req.body

          // check if there are available tickets left
          const [screeningsData] = await screenings.findAll()

          if (
            !screeningsData ||
            screeningsData.numberOfTicketsLeft < numTickets
          ) {
            return res.status(StatusCodes.NOT_FOUND).json({
              message: 'SOLD OUT - the booking is unavailable.',
            })
          }

          // update screenings table
          const updateScreeningsTicketNum: number =
            screeningsData.numberOfTicketsLeft - numTickets

          await screenings.update(screeningId, {
            numberOfTicketsLeft: updateScreeningsTicketNum,
          })

          // create / update tickets data
          const currentDate = new Date()
          const bookingTimestamp = currentDate.toISOString()

          await tickets.create({
            userId,
            movieId,
            screeningId,
            numTickets,
            bookingTimestamp,
          })

          // send message that booking successfull
          return res
            .status(StatusCodes.CREATED)
            .json({ message: 'Booking successful!' })
        } catch (error) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
        }
      })
    )

  return router
}
