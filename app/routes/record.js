import express from 'express'
import { recordController } from '../controllers/record.js'

const router = express.Router({ strict: true })

router.get('/', recordController.list)

router.all('/:nhsNumber*', recordController.read)

router.get('/:nhsNumber', recordController.show)

export const recordRoutes = router
