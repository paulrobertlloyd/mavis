export const navigation = (request, response, next) => {
  const { data } = request.session
  const { __ } = response.locals

  response.locals.navigation = {
    // `header.primaryLinks` renders empty items, so need different arrays
    primaryLinks: data.token?.admin
      ? [
          {
            url: '/sessions',
            label: __('session.list.title')
          },
          {
            url: '/vaccines',
            label: __('vaccine.list.title')
          },
          {
            url: '/users',
            label: __('user.list.title')
          },
          {
            url: '/account',
            label: __('account.show.title')
          },
          {
            url: '/account/sign-out',
            label: __('account.sign-out.title')
          }
        ]
      : [
          {
            url: '/sessions',
            label: __('session.list.title')
          },
          {
            url: '/account',
            label: __('account.show.title')
          },
          {
            url: '/account/sign-out',
            label: __('account.sign-out.title')
          }
        ]
  }

  next()
}
