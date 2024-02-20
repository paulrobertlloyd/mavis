import { Child } from '../models/child.js'
import { Parent } from '../models/parent.js'
import { Response } from '../models/response.js'

export const responseController = {
  read(request, response, next) {
    const { nhsn, uuid } = request.params
    const { data } = request.session

    const { responses } = data.patients[nhsn]

    let consentResponse = responses.find((response) => response.uuid === uuid)
    consentResponse = new Response(consentResponse)
    consentResponse.child = new Child(consentResponse.child)
    consentResponse.parent = new Parent(consentResponse.parent)

    response.locals.response = consentResponse

    next()
  },

  redirect(request, response) {
    response.redirect(`/patients/${request.params.nhsn}`)
  },

  show(request, response) {
    response.render('response/show')
  }
}
