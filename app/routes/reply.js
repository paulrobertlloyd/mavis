import express from 'express'
import { replyController } from '../controllers/reply.js'

const router = express.Router({ strict: true, mergeParams: true })

router.get('/', replyController.redirect)

router.get('/new', replyController.new)
router.post('/:uuid/?:form(new)/check-answers', replyController.update)

router.all('/:uuid*', replyController.read)

router.get('/:uuid', replyController.show)

// router.get('/:uuid/?:form(edit)', replyController.edit)
// router.post('/:uuid/?:form(edit)', replyController.update)

router.all('/:uuid/?:form(new|edit)/:view', replyController.readForm)
router.get('/:uuid/?:form(new|edit)/:view', replyController.showForm)
router.post('/:uuid/?:form(new|edit)/:view', replyController.updateForm)

export const replyRoutes = router