import { Campaign } from '../models/campaign.js'
import { Event } from '../models/event.js'
import { Session } from '../models/session.js'

/**
 * Create a boilerplate event
 * @param {string} id - Event id
 * @param {object} options - Event options
 * @returns Event
 */
export const createEvent = (name, options) => {
  const { campaigns, sessions, record, user } = options

  const campaign = new Campaign(
    Object.values(campaigns).find((campaign) =>
      campaign.cohort.includes(record.nhsn)
    )
  )

  const session = new Session(
    Object.values(sessions).find((session) =>
      session.cohort.includes(record.nhsn)
    )
  )

  // Add patient to session 2 days after campaign was created
  session.created = new Date(campaign.date)
  session.created.setDate(session.created.getDate() + 2)

  switch (name) {
    case 'SELECT_COHORT':
      return new Event({
        type: 'SELECT',
        name: `Added to ${campaign.name} campaign cohort`,
        date: campaign.date,
        user_uuid: user.uuid
      })
    case 'SELECT_SESSION':
      return new Event({
        type: 'SELECT',
        name: `Added to a ${campaign.name} session cohort at ${session.location.name}`,
        date: session.created,
        user_uuid: user.uuid
      })
  }
}
