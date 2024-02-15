import express from 'express'
import { patientController } from '../controllers/patient.js'

const router = express.Router({ strict: true })

router.all('/:nhsn*', patientController.read)

router.get('/:nhsn', patientController.show)

export const patientRoutes = router
