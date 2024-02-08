import { Batch } from '../models/batch.js'
import { Vaccine } from '../models/vaccine.js'

export const vaccineController = {
  action(type) {
    return (request, response) => {
      response.render('vaccines/action', { type })
    }
  },

  list(request, response) {
    const { batches, vaccines } = request.session.data

    response.render('vaccines/list', {
      vaccines: Object.values(vaccines).map((vaccine) => {
        vaccine = new Vaccine(vaccine)

        vaccine.batches = Object.values(batches)
          .filter((batch) => batch.vaccine_gtin === vaccine.gtin)
          .map((batch) => new Batch(batch))

        return vaccine
      })
    })
  },

  show(request, response) {
    response.render('vaccines/show')
  },

  read(request, response, next) {
    const { vaccines } = request.session.data
    const { gtin } = request.params

    response.locals.vaccine = new Vaccine(vaccines[gtin])

    next()
  },

  delete(request, response) {
    const { vaccines } = request.session.data
    const { __, vaccine } = response.locals

    delete vaccines[vaccine.gtin]

    request.flash('success', __(`vaccine.success.delete`))
    response.redirect('/vaccines')
  }
}
