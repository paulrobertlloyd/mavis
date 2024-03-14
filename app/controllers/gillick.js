import { wizard } from 'nhsuk-prototype-rig'
import { Gillick } from '../models/gillick.js'
import { Patient } from '../models/patient.js'

export const gillickController = {
  redirect(request, response) {
    const { id, nhsn } = request.params

    response.redirect(`/sessions/${id}/${nhsn}`)
  },

  new(request, response) {
    const { id, nhsn } = request.params
    const { data } = request.session

    delete data.wizard
    delete data.patient?.gillick

    response.redirect(`/sessions/${id}/${nhsn}/gillick/new/start`)
  },

  update(request, response) {
    const { gillick } = request.app.locals
    const { form, id, nhsn } = request.params
    const { data } = request.session
    const { __, patient } = response.locals

    data.patients[nhsn] = new Patient(patient)

    data.patients[nhsn].assess = new Gillick({
      ...gillick, // Previous values
      ...data.wizard, // Wizard values (new flow)
      ...request.body.gillick, // New values (edit flow)
      ...(data.token && { created_user_uuid: data.token.uuid })
    })

    delete data.wizard

    const action = form === 'edit' ? 'update' : 'create'
    request.flash('success', __(`gillick.success.${action}`))

    response.redirect(`/sessions/${id}/${nhsn}`)
  },

  readForm(request, response, next) {
    const { gillick } = request.app.locals
    const { form, nhsn } = request.params
    const { data } = request.session

    request.app.locals.gillick = new Gillick({
      ...(form === 'edit' && gillick), // Previous values
      ...data.wizard // Wizard values,
    })

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

    next()
  },

  showForm(request, response) {
    const { view } = request.params

    response.render(`patient/gillick/${view}`)
  },

  updateForm(request, response) {
    const { gillick } = request.app.locals
    const { form, id, nhsn } = request.params
    const { data } = request.session
    const { paths } = response.locals

    data.wizard = new Gillick({
      ...gillick, // Previous values
      ...request.body.gillick // New value
    })

    const next = form === 'edit' ? `/sessions/${id}/${nhsn}` : paths.next

    response.redirect(next)
  }
}
