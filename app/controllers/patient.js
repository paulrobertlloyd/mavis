import { Event } from '../models/event.js'
import { Patient } from '../models/patient.js'
import { Session } from '../models/session.js'
import { User } from '../models/user.js'

export const patientController = {
  show(request, response) {
    const { id, nhsn } = request.params
    const { activity } = request.query
    const { data } = request.session

    const session = new Session(data.sessions[id])

    response.render('patient/show', {
      activity,
      paths: { back: `${session.uri}/${activity}` },
      patient: new Patient(data.patients[nhsn])
    })
  },

  log(request, response) {
    const { id, nhsn } = request.params
    const { activity } = request.query
    const { data } = request.session

    const session = new Session(data.sessions[id])

    response.render('patient/log', {
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
  }
}
