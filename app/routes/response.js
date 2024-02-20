import express from 'express'
import { responseController } from '../controllers/response.js'

const router = express.Router({ strict: true, mergeParams: true })

router.get('/', responseController.redirect)

router.all('/:uuid*', responseController.read)

router.get('/:uuid', responseController.show)

export const responseRoutes = router
