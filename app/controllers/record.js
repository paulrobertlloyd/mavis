import { Record } from '../models/record.js'

export const recordController = {
  list(request, response) {
    const { data } = request.session

    response.render('records/list', {
      records: Object.values(data.records).map((record) => new Record(record))
    })
  },

  show(request, response) {
    response.render('records/show')
  },

  read(request, response, next) {
    const { data } = request.session
    const { nhsNumber } = request.params

    response.locals.record = new Record(data.records[nhsNumber])

    next()
  }
}
