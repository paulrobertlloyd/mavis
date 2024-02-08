import express from 'express'
import flash from 'express-flash'
import { internationalisation } from './middleware/internationalisation.js'
import { notification } from './middleware/notification.js'
import { accountRoutes } from './routes/account.js'
import { batchRoutes } from './routes/batch.js'
import { userRoutes } from './routes/user.js'
import { vaccineRoutes } from './routes/vaccine.js'

const router = express.Router({ strict: true })

router.use(internationalisation)
router.use(flash(), notification)

router.use('/account', accountRoutes)
router.use('/users', userRoutes)
router.use('/vaccines', vaccineRoutes)
router.use('/vaccines/:gtin', batchRoutes)

export default router
