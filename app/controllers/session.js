import { wizard } from 'nhsuk-prototype-rig'
import { Patient } from '../models/patient.js'
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

  activity(request, response) {
    const { activity } = request.params
    const consent = request.query.consent || 'NoResponse'
    const { __, patients } = response.locals

    const navigationItems = [
      'NoResponse',
      'Given',
      'Refused',
      'Inconsistent'
    ].map((item) => ({
      text: __(`consent.${item}.label`),
      count: patients.filter((patient) => patient.consent === item).length,
      href: `?consent=${item}`,
      current: item === consent
    }))

    response.render('sessions/activity', {
      activity,
      consent,
      navigationItems
    })
  },

  read(request, response, next) {
    const { id } = request.params
    const { data } = request.session

    const session = new Session(data.sessions[id])

    response.locals.session = new Session(data.sessions[id])
    response.locals.patients = session.cohort.map(
      (record) => new Patient(data.patients[record])
    )

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
      [`/${id}/${form}/campaign-uuid`]: {},
      [`/${id}/${form}/urn`]: {},
      [`/${id}/${form}/cohort`]: {},
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

    response.locals.campaignItems = Object.entries(data.campaigns).map(
      ([uuid, campaign]) => ({
        text: campaign.name,
        value: uuid
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
