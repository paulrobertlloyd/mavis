import express from 'express'
import { responseController } from '../controllers/response.js'

const router = express.Router({ strict: true })

router.get('/', responseController.list)

router.all('/:uuid*', responseController.read)

router.get('/:uuid', responseController.show)

export const responseRoutes = router
