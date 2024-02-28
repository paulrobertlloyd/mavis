export const navigation = (request, response, next) => {
  const { data } = request.session
  const { __ } = response.locals

  const accountLabel = data?.token?.email || __('account.show.title')

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
            url: '/reports',
            label: __('report.list.title')
          },
          {
            url: '/users',
            label: __('user.list.title')
          },
          {
            url: '/account',
            label: accountLabel
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
            url: '/reports',
            label: __('report.list.title')
          },
          {
            url: '/account',
            label: accountLabel
          },
          {
            url: '/account/sign-out',
            label: __('account.sign-out.title')
          }
        ]
  }

  next()
}