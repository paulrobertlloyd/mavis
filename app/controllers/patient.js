import { Patient } from '../models/patient.js'
import { Session } from '../models/session.js'

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
  }
}
