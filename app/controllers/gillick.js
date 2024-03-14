import _ from 'lodash'
import { wizard } from 'nhsuk-prototype-rig'
import { Patient, PatientEvents } from '../models/patient.js'

export const gillickController = {
  read(request, response, next) {
    const { form, nhsn } = request.params
    const { data } = request.session

    const journey = {
      [`/`]: {},
      [`/${form}/start`]: {},
      [`/${form}/competence`]: {},
      [`/${form}/assessment`]: {},
      [`/${form}/check-answers`]: {},
      [`/?`]: {}
    }

    response.locals.paths = {
      ...wizard(journey, request),
      ...(form === 'edit' && {
        back: `/patients/${nhsn}/gillick/edit`,
        next: `/patients/${nhsn}/gillick/edit`
      })
    }

    response.locals.patient = new Patient(
      _.merge(
        data.patients[nhsn], // Previous values
        data.wizard // Wizard values,
      )
    )

    next()
  },

  redirect(request, response) {
    const { id, nhsn } = request.params

    response.redirect(`/sessions/${id}/${nhsn}?activity=consent`)
  },

  show(request, response) {
    const { view } = request.params

    response.render(`patient/gillick/${view}`)
  },

  new(request, response) {
    const { id, nhsn } = request.params
    const { data } = request.session

    delete data.wizard
    delete data.patient?.gillick

    response.redirect(`/sessions/${id}/${nhsn}/gillick/new/start`)
  },

  update(request, response) {
    const { form, id, nhsn, view } = request.params
    const { data } = request.session
    const { paths, patient } = response.locals

    data.wizard = new Patient(
      _.merge(
        patient, // Previous values
        request.body.patient // New value
      )
    )

    const next = form === 'edit' ? `/sessions/${id}/${nhsn}` : paths.next

    if (view === 'check-answers') {
      PatientEvents.emit('gillick:update', patient)
    }

    response.redirect(next)
  }
}
