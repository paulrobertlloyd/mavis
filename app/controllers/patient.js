import { Patient } from '../models/patient.js'

export const patientController = {
  show(request, response) {
    response.render('patients/show')
  },

  read(request, response, next) {
    const { data } = request.session
    const { nhsn } = request.params

    response.locals.patient = new Patient(data.patients[nhsn], data)

    next()
  }
}
