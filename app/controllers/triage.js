import { Patient } from '../models/patient.js'

export const triageController = {
  update(request, response) {
    const { form, id, nhsn } = request.params
    const { data } = request.session
    const { __ } = response.locals
    const patient = new Patient(response.locals.patient)

    data.patients[nhsn] = patient
    data.patients[nhsn].triage = {
      ...data.triage,
      ...(data.token && { created_user_uuid: data.token.uuid })
    }

    delete data.triage

    const action = form === 'edit' ? 'update' : 'create'
    request.flash('success', __(`triage.success.${action}`, { patient }))

    response.redirect(`/sessions/${id}/triage`)
  }
}
