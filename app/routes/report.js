import express from 'express'
import { reportController } from '../controllers/report.js'

const router = express.Router({ strict: true })

router.get('/', reportController.list)

router.get('/:type?', reportController.show)

export const reportRoutes = router
