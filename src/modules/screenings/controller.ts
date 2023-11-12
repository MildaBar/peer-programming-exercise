import { Router } from 'express'
import { omit } from 'lodash/fp'
import { StatusCodes } from 'http-status-codes'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'

import buildRespository from './repository'
import * as schema from './schema'

export default (db: Database) => {
  const screenings = buildRespository(db)
  const router = Router()

  router
    .route('/')
    .get(
      jsonRoute(async (req, res) => {
        try {
          const allScreeningsData = await screenings.findAll()

          if (!allScreeningsData) {
            return res
              .status(StatusCodes.NOT_FOUND)
              .json({ error: 'Screenings not found.' })
          }

          const screeningsWithoutId = allScreeningsData.map((screening) =>
            omit(['id'], screening)
          )

          return res.status(StatusCodes.OK).json(screeningsWithoutId)
        } catch (error) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
        }
      })
    )
    .post(
      jsonRoute(async (req, res) => {
        const body = schema.parseInsertable(req.body)

        if (!body) {
          return res
            .status(400)
            .json({ error: 'Invalid request. Provide all the required data.' })
        }

        try {
          const result = await screenings.create(body)
          return res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
          console.error('Error occured during screenings creation:', error)
          return res.status(500).json({ error: 'Internal Server Error.' })
        }
      })
    )
    .patch(
      jsonRoute(async (req, res) => {
        const id = schema.parseId(req.body.id)
        const bodyPatch = schema.parseUpdateable(req.body)
        const updateScreeningsData = await screenings.update(id, bodyPatch)

        if (!updateScreeningsData) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: 'Screenings data not found.' })
        }
        return updateScreeningsData
      })
    )
    .delete(
      jsonRoute(async (req, res) => {
        const id = schema.parseId(req.body.id)
        try {
          await screenings.remove(id)
          return res
            .status(StatusCodes.OK)
            .json({ message: 'Screenings data deleted.' })
        } catch (error) {
          console.error('Error occurred during screenings removement:', error)
          return res.status(500).json({ error: 'Internal Server Error.' })
        }
      })
    )

  return router
}
