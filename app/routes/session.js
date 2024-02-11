import express from 'express'
import { sessionController } from '../controllers/session.js'

const router = express.Router({ strict: true })

router.get('/', sessionController.list)

router.all('/:id*', sessionController.read)

router.get('/:id', sessionController.show)

router.all('/:id/edit', sessionController.edit)
router.all('/:id/edit/*', sessionController.editWizard)
router.get('/:id/edit/:view', sessionController.editView)
router.post('/:id/edit/:view', sessionController.update)

export const sessionRoutes = router
