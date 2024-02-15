import express from 'express'
import { patientController } from '../controllers/patient.js'

const router = express.Router({ strict: true })

router.all('/:nhsNumber*', patientController.read)

router.get('/:nhsNumber', patientController.show)

export const patientRoutes = router
