import { wizard } from 'nhsuk-prototype-rig'
import schools from '../datasets/schools.js'
import { Session } from '../models/session.js'

export const sessionController = {
  editWizard(request, response, next) {
    const { id } = request.params

    const journey = {
      [`/${id}`]: {},
      [`/${id}/edit`]: {},
      [`/${id}/edit/format`]: {},
      [`/${id}/edit/school`]: {},
      [`/${id}/edit/type`]: {},
      [`/${id}/edit/date`]: {},
      [`/${id}/edit/schedule`]: {},
      [`/${id}/edit/confirm`]: {},
      [`/${id}`]: {}
    }

    response.locals.paths = {
      ...wizard(journey, request),
      next: `/${id}/edit`
    }

    next()
  },

  editView(request, response) {
    const { view } = request.params
    const { campaigns } = request.session.data

    response.render(`sessions/edit/${view}`, {
      urnItems: Object.values(schools).map((school) => ({
        text: school.name,
        value: school.urn
      })),
      campaignTypeItems: Object.entries(campaigns).map(([id, campaign]) => ({
        text: campaign.name,
        value: id
      }))
    })
  },

  edit(request, response) {
    response.render('sessions/edit')
  },

  list(request, response) {
    const { sessions } = request.session.data

    response.render('sessions/list', {
      sessions: Object.values(sessions).map((session) => new Session(session))
    })
  },

  show(request, response) {
    response.render('sessions/show')
  },

  read(request, response, next) {
    const { sessions } = request.session.data
    const { id } = request.params

    response.locals.session = new Session(sessions[id])

    next()
  },

  update(request, response) {
    const { paths, session } = response.locals

    request.session.data.sessions[session.id] = new Session({
      ...session,
      ...request.body.session
    })

    response.redirect(`/sessions/${paths.next}`)
  }
}
