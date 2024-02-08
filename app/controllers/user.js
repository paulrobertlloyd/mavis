import { User } from '../models/user.js'
import { getRegistrarItems } from '../utils/registrar.js'

export const userController = {
  action(type) {
    return (request, response) => {
      response.render('users/action', { type })
    }
  },

  edit(request, response) {
    response.render('users/edit', {
      registrarItems: getRegistrarItems()
    })
  },

  list(request, response) {
    const { users } = request.session.data

    response.render('users/list', {
      users: Object.values(users).map((user) => new User(user))
    })
  },

  new(request, response) {
    response.render('users/new')
  },

  show(request, response) {
    response.render('users/show')
  },

  create(request, response) {
    const { __ } = response.locals

    const user = new User(request.body.user)

    request.session.data.users[user.uuid] = user

    request.flash('success', __(`user.success.create`, user.fullName))
    response.redirect('/users')
  },

  read(request, response, next) {
    const { users } = request.session.data
    const { uuid } = request.params

    response.locals.user = new User(users[uuid])

    next()
  },

  update(request, response) {
    const { __, user } = response.locals

    request.session.data.users[user.uuid] = new User({
      ...user,
      ...request.body.user
    })
    request.flash('success', __(`user.success.update`))
    response.redirect(`/users/${user.uuid}`)
  },

  delete(request, response) {
    const { __, user } = response.locals
    const { users } = request.session.data

    delete users[user.uuid]

    request.flash('success', __(`user.success.delete`))
    response.redirect('/users')
  }
}
