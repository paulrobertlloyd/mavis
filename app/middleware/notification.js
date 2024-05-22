export const notification = (request, response, next) => {
  response.locals.success = request.flash('success').map((text) => ({
    type: 'success',
    text
  }))[0]

  response.locals.message = request.flash('message').map((text) => ({
    text
  }))[0]

  next()
}
