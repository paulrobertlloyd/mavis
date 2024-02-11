import { Campaign, HealthQuestion } from '../models/campaign.js'
import { Vaccine } from '../models/vaccine.js'

export const campaignController = {
  list(request, response) {
    const { data } = request.session

    response.render('campaigns/list', {
      campaigns: Object.values(data.campaigns).map((campaign) => {
        campaign = new Campaign(campaign)
        campaign.vaccines = campaign.vaccines.map(
          (vaccine) => new Vaccine(data.vaccines[vaccine]).brandWithName
        )
        return campaign
      })
    })
  },

  show(request, response) {
    response.render('campaigns/show')
  },

  read(request, response, next) {
    const { uuid } = request.params
    const { data } = request.session

    const campaign = new Campaign(data.campaigns[uuid])

    response.locals.campaign = campaign
    response.locals.vaccines = campaign.vaccines.map(
      (vaccine) => new Vaccine(data.vaccines[vaccine]).brandWithName
    )
    response.locals.healthQuestions = campaign.healthQuestions.map(
      (question) => `- ${HealthQuestion[question]}`
    )

    next()
  }
}
