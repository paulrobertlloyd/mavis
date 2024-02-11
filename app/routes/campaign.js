import express from 'express'
import { campaignController } from '../controllers/campaign.js'

const router = express.Router({ strict: true })

router.get('/', campaignController.list)

router.all('/:uuid*', campaignController.read)

router.get('/:uuid', campaignController.show)

export const campaignRoutes = router
