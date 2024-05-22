import { Patient, ScreenOutcome } from '../models/patient.js'

export const triageController = {
  update(request, response) {
    const { form, id, nhsn } = request.params
    const { data } = request.session
    const { activity } = request.app.locals
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

    response.redirect(`/sessions/${id}/${activity || 'triage'}`)
  },

  readForm(request, response, next) {
    const { patient } = response.locals
    const { id, nhsn } = request.params

    response.locals.paths = {
      back: `/sessions/${id}/${nhsn}`,
      next: `/sessions/${id}/${nhsn}/triage/new`
    }

    response.locals.screenItems = Object.entries(ScreenOutcome).map(
      ([key, value]) => ({
        text: ScreenOutcome[key],
        value,
        checked: patient.screen.value === value
      })
    )

    next()
  },

  showForm(request, response) {
    const { view } = request.params

    response.render(`triage/form/${view}`)
  }
}
