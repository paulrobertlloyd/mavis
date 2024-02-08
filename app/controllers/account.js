import { User } from '../models/user.js'
import { getRegistrarItems } from '../utils/registrar.js'

export const accountController = {
  signIn(request, response) {
    response.render('account/sign-in')
  },

  login(request, response) {
    const { email } = request.body
    const { data } = request.session

    const user = Object.values(data.users).find((user) => user.email === email)

    request.session.data.token = user || Object.values(data.users).at(-1)
    response.redirect('/dashboard')
  },

  logout(request, response) {
    delete request.session.data.token

    response.redirect('/')
  },

  edit(request, response) {
    const { __ } = response.locals

    response.render('users/edit', {
      paths: false,
      registrarItems: getRegistrarItems(),
      title: __('account.show.title')
    })
  },

  read(request, response, next) {
    const { data } = request.session

    response.locals.user = data.token && new User(data.token)

    next()
  },

  update(request, response) {
    const { __, user } = response.locals

    request.session.data.users[user.uuid] = new User({
      ...user,
      ...request.body.user
    })

    request.flash('success', __(`account.success.update`))
    response.redirect(`/dashboard`)
  }
}
