import express from 'express'
import flash from 'express-flash'
import { internationalisation } from './middleware/internationalisation.js'
import { notification } from './middleware/notification.js'
import { userRoutes } from './routes/user.js'

const router = express.Router({ strict: true })

router.use(internationalisation)
router.use(flash(), notification)

router.use('/users', userRoutes)

export default router
