import { Reply } from '../models/reply.js'

export const replyController = {
  read(request, response, next) {
    const { uuid } = request.params
    const { patient } = response.locals

    const reply = patient.replies.find((reply) => reply.uuid === uuid)
    response.locals.reply = new Reply(reply)

    next()
  },

  redirect(request, response) {
    response.redirect(`/patients/${request.params.nhsn}`)
  },

  show(request, response) {
    response.render('reply/show')
  }
}
