import express from 'express'
import { BatchController } from '../controllers/batch.js'

const router = express.Router({ strict: true, mergeParams: true })

router.get('/new', BatchController.new)
router.post('/new', BatchController.create)

router.all('/:id*', BatchController.read)

router.get('/:id/edit', BatchController.edit)
router.post('/:id/edit', BatchController.update)

export const batchRoutes = router
