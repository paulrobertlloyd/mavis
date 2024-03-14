import express from 'express'
import { gillickController } from '../controllers/gillick.js'

const router = express.Router({ strict: true, mergeParams: true })

router.get('/', gillickController.redirect)

router.get('/new', gillickController.new)

router.all('/?:form(new|edit)/:view', gillickController.read)
router.get('/?:form(new|edit)/:view', gillickController.show)
router.post('/?:form(new|edit)/:view', gillickController.update)

export const gillickRoutes = router
