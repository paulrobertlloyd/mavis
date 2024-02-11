import express from 'express'
import { AccountController } from '../controllers/account.js'

const router = express.Router({ strict: true })

router.get('/sign-in', AccountController.signIn)
router.post('/sign-in', AccountController.login)

router.get('/sign-out', AccountController.logout)

router.all('/*', AccountController.read)

router.get('/', AccountController.edit)
router.post('/', AccountController.update)

export const accountRoutes = router
