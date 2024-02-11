import _ from 'lodash'
import { faker } from '@faker-js/faker'
import { Batch } from '../app/models/batch.js'
import { Campaign } from '../app/models/campaign.js'
import { Record } from '../app/models/record.js'
import { Session } from '../app/models/session.js'
import { User } from '../app/models/user.js'
import { createCohort } from '../app/utils/cohort.js'
import { generateDataFile } from './generate-data-file.js'

// Example admin user
const user = new User({
  admin: true,
  email: 'nurse.joy@example.com',
  firstName: 'Jane',
  lastName: 'Joy',
  registrar: 'General Medical Council',
  registration: '7233456'
})

// Batch
const batches = faker.helpers.multiple(Batch.generate, { count: 20 })

// Records
const records = faker.helpers.multiple(Record.generate, { count: 400 })

// Campaigns
const campaigns = [
  Campaign.generate('flu', createCohort('flu', records), user),
  Campaign.generate('hpv', createCohort('hpv', records), user),
  Campaign.generate(
    '3-in-1-men-acwy',
    createCohort('3-in-1-men-acwy', records),
    user
  )
]

// Sessions
let sessions = []
for (const campaign of Object.values(campaigns)) {
  const session = () => ({ ...Session.generate(108912, [], campaign, user) })
  sessions = [...sessions, ...faker.helpers.multiple(session, { count: 20 })]
}

// Users
let users = faker.helpers.multiple(User.generate, { count: 20 })
users = [user, ...users]

// Generate date files
generateDataFile('.data/batches.json', _.keyBy(batches, 'id'))
generateDataFile('.data/campaigns.json', _.keyBy(campaigns, 'uuid'))
generateDataFile('.data/records.json', _.keyBy(records, 'nhsn'))
generateDataFile('.data/sessions.json', _.keyBy(sessions, 'id'))
generateDataFile('.data/users.json', _.keyBy(users, 'uuid'))
