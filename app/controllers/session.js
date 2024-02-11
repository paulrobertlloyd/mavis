import { wizard } from 'nhsuk-prototype-rig'
import campaignTypes from '../datasets/campaign-types.js'
import { Session } from '../models/session.js'

export const sessionController = {
  list(request, response) {
    const { data } = request.session

    response.render('sessions/list', {
      sessions: Object.values(data.sessions).map(
        (session) => new Session(session)
      )
    })
  },

  show(request, response) {
    response.render('sessions/show')
  },

  read(request, response, next) {
    const { id } = request.params
    const { data } = request.session

    response.locals.session = new Session(data.sessions[id])

    next()
  },

  edit(request, response) {
    const { data } = request.session
    const { session } = response.locals

    response.locals.session = new Session({
      ...session, // Previous values
      ...data.wizard // Wizard values
    })

    response.render('sessions/edit')
  },

  new(request, response) {
    const { data } = request.session

    delete data.wizard

    const session = new Session()

    data.wizard = session

    response.redirect(`/sessions/${session.id}/new/format`)
  },

  update(request, response) {
    const { form, id } = request.params
    const { data } = request.session
    const { __, session } = response.locals

    data.sessions[id] = new Session({
      ...session, // Previous values
      ...data.wizard // Wizard values
    })

    delete data.wizard

    const action = form === 'edit' ? 'update' : 'create'
    request.flash('success', __(`session.success.${action}`, session.name))
    response.redirect(`/sessions/${id}`)
  },

  readForm(request, response, next) {
    const { form, id } = request.params
    const { data } = request.session
    const { session } = response.locals

    const journey = {
      [`/`]: {},
      [`/${id}/${form}/format`]: {},
      [`/${id}/${form}/campaign-type`]: {},
      [`/${id}/${form}/urn`]: {},
      [`/${id}/${form}/date`]: {},
      [`/${id}/${form}/schedule`]: {},
      [`/${id}/${form}/check-answers`]: {},
      [`/${id}`]: {}
    }

    response.locals.paths = {
      ...wizard(journey, request),
      ...(form === 'edit' && {
        back: `/sessions/${id}/edit`,
        next: `/sessions/${id}/edit`
      })
    }

    response.locals.campaignTypeItems = Object.entries(campaignTypes).map(
      ([id, campaign]) => ({
        text: campaign.name,
        value: id
      })
    )

    response.locals.urnItems = Object.entries(data.schools).map(
      ([urn, school]) => ({
        text: school.name,
        value: urn
      })
    )

    response.locals.session = new Session({
      ...(form === 'edit' && session), // Previous values
      ...data.wizard // Wizard values,
    })

    next()
  },

  showForm(request, response) {
    const { view } = request.params

    response.render(`sessions/form/${view}`)
  },

  updateForm(request, response) {
    const { data } = request.session
    const { paths, session } = response.locals

    data.wizard = new Session({
      ...session, // Previous values
      ...request.body.session // New value
    })

    response.redirect(paths.next)
  }
}
