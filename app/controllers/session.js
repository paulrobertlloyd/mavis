import { wizard } from 'nhsuk-prototype-rig'
import { CONSENT_OUTCOME, Patient } from '../models/patient.js'
import { Event } from '../models/event.js'
import { Session } from '../models/session.js'
import { User } from '../models/user.js'

const consentSort = Object.fromEntries(
  CONSENT_OUTCOME.map((outcome, index) => [outcome, index])
)

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

  patients(request, response) {
    const { activity } = request.params
    const outcome = request.query.outcome || 'NO_RESPONSE'
    const consent = outcome.toUpperCase().replace('-', '_')

    response.locals.patients = response.render('sessions/patients', {
      activity,
      consent,
      outcome
    })
  },

  patient(request, response) {
    const { activity, id, nhsn } = request.params
    const { data } = request.session

    const session = new Session(data.sessions[id])

    response.render('patients/show', {
      activity,
      paths: { back: `${session.uri}/${activity}` },
      patient: new Patient(data.patients[nhsn])
    })
  },

  log(request, response) {
    const { activity, id, nhsn } = request.params
    const { data } = request.session

    const session = new Session(data.sessions[id])

    response.render('patients/log', {
      activity,
      paths: { back: `${session.uri}/${activity}` },
      patient: new Patient(data.patients[nhsn]),
      log: Object.values(data.patients[nhsn].log)
        .map((event) => ({
          ...new Event(event),
          formattedDate: new Event(event).formattedDate,
          ...(event.user_uuid && {
            user: new User(data.users[event.user_uuid])
          })
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    })
  },

  read(request, response, next) {
    const { id } = request.params
    const { data } = request.session

    const session = new Session(data.sessions[id])

    response.locals.session = session
    response.locals.patients = Object.values(data.patients)
      .filter((patient) => session.cohort.includes(patient.nhsn))
      .map((patient) => new Patient(patient))
      .sort((a, b) => consentSort[a.consent] - consentSort[b.consent])

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
