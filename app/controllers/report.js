import { Campaign } from '../models/campaign.js'

export const reportController = {
  list(request, response) {
    const id = request.params.id || 'flu'

    response.redirect(`/reports/${id}`)
  },

  show(request, response) {
    const { type } = request.params
    const { data } = request.session

    const campaign = Object.values(data.campaigns).find(
      (campaign) => campaign.type === type
    )

    response.render('reports/show', {
      campaign: new Campaign(campaign),
      type
    })
  }
}
