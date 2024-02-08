import { Batch } from '../models/batch.js'

export const BatchController = {
  edit(request, response) {
    response.render('batch/edit')
  },

  new(request, response) {
    response.render('batch/new')
  },

  create(request, response) {
    const { __ } = response.locals
    const { gtin } = request.params

    const batch = new Batch({
      ...request.body.batch,
      vaccine_gtin: gtin
    })

    request.session.data.batches[batch.id] = batch

    request.flash('success', __(`batch.success.create`, batch.id))
    response.redirect('/vaccines')
  },

  read(request, response, next) {
    const { batches } = request.session.data
    const { id } = request.params

    response.locals.batch = new Batch(batches[id])

    next()
  },

  update(request, response) {
    const { batches } = request.session.data
    const { __ } = response.locals

    const batch = new Batch({
      ...response.locals.batch,
      ...request.body.batch
    })

    batch.expiresDate = request.body.batch.expiresDate

    batches[batch.id] = batch

    request.flash('success', __(`batch.success.update`))
    response.redirect(`/vaccines`)
  }
}
