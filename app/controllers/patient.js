import { Patient } from '../models/patient.js'
import { Session } from '../models/session.js'

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
  }
}
