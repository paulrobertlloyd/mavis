import { Event } from '../models/event.js'
import { Patient } from '../models/patient.js'
import { Session } from '../models/session.js'
import { User } from '../models/user.js'

export const patientController = {
  read(request, response, next) {
    const { id, nhsn } = request.params
    const { data } = request.session

    response.locals.patient = new Patient(data.patients[nhsn])
    response.locals.session = new Session(data.sessions[id])

    next()
  },

  show(request, response) {
    const { activity } = request.app.locals
    const { session } = response.locals

    response.render('patient/show', {
      activity,
      paths: { back: `${session.uri}/${activity}` }
    })
  },

  events(request, response) {
    const { activity } = request.app.locals
    const { data } = request.session
    const { patient, session } = response.locals

    response.render('patient/events', {
      activity,
      events: Object.values(patient.events)
        .map((event) => ({
          ...new Event(event),
          ...{ formattedDate: new Event(event).formattedDate },
          ...{ formattedDateTime: new Event(event).formattedDateTime },
          ...(event.user_uuid && {
            user: new User(data.users[event.user_uuid])
          })
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
      paths: { back: `${session.uri}/${activity}` }
    })
  }
}
