import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'

export default (db: Database) => {
  const messages = buildRespository(db)
  const router = Router()

  router.get(
    '/',
    jsonRoute(async (req, res) => {
      try {
        if (typeof req.query.id === 'string' && req.query.id.trim() !== '') {
          const ids = req.query.id.split(',').map(Number)
          if (!ids || !ids.length) {
            return res.status(400).json({ error: 'No IDs provided' })
          }

          const movies = await messages.findByIds(ids)
          return res.status(200).json(movies)
        }
        return res
          .status(400)
          .json({ message: 'Invalid format for movie IDs.' })
      } catch (error) {
        return res
          .status(500)
          .json({ error: error.message || 'Error getting movie.' })
      }
    })
  )

  return router
}
