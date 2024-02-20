import { Child } from '../models/child.js'
import { Parent } from '../models/parent.js'
import { Response } from '../models/response.js'

export const responseController = {
  list(request, response) {
    const { data } = request.session

    response.render('responses/list', {
      responses: Object.values(data.responses).map((response) => {
        response = new Response(response)
        response.child = new Child(response.child)
        response.parent = new Parent(response.parent)
        return response
      })
    })
  },

  show(request, response) {
    response.render('responses/show')
  },

  read(request, response, next) {
    const { data } = request.session
    const { uuid } = request.params

    const consentResponse = new Response(data.responses[uuid])
    consentResponse.child = new Child(consentResponse.child)
    consentResponse.parent = new Parent(consentResponse.parent)

    response.locals.response = consentResponse

    next()
  }
}
