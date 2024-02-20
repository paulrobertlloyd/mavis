import _ from 'lodash'
import { faker } from '@faker-js/faker'
import { Batch } from '../app/models/batch.js'
import { Campaign } from '../app/models/campaign.js'
import { Patient } from '../app/models/patient.js'
import { Record } from '../app/models/record.js'
import { Response } from '../app/models/response.js'
import { Session } from '../app/models/session.js'
import { User } from '../app/models/user.js'
import { createEvent } from '../app/utils/event.js'
import { generateDataFile } from './generate-data-file.js'

// Example admin user
const user = new User({
  admin: true,
  email: 'jane.joy@nhs.net',
  firstName: 'Jane',
  lastName: 'Joy',
  registrar: 'gmc',
  registration: '7233456'
})

// Batch
const batches = _.keyBy(
  faker.helpers.multiple(Batch.generate, { count: 20 }),
  'id'
)

// Records
const records = _.keyBy(
  faker.helpers.multiple(Record.generate, { count: 50 }),
  'nhsn'
)

// Campaigns
const campaigns = _.keyBy(
  [
    Campaign.generate('flu', records),
    Campaign.generate('hpv', records),
    Campaign.generate('3-in-1-men-acwy', records)
  ],
  'uuid'
)

// Sessions
let sessions = []
for (const campaign of Object.values(campaigns)) {
  const session = () => ({ ...Session.generate(campaign) })
  sessions = [...sessions, ...faker.helpers.multiple(session, { count: 20 })]
}
sessions = _.keyBy(sessions, 'id')

// Patients in-session
let patients = []
for (const record of Object.values(records)) {
  const log = [
    createEvent('SELECT_COHORT', { record, campaigns, sessions, user }),
    createEvent('SELECT_SESSION', { record, campaigns, sessions, user })
  ]

  patients = [...patients, Patient.generate(record, log)]
}
patients = _.keyBy(patients, 'nhsn')

// Responses
let responses = []
for (const patient of Object.values(patients)) {
  const campaign = { type: 'flu' }
  const session = { urn: '100216' }
  const response = () => ({ ...Response.generate(campaign, session, patient) })
  responses = [...responses, ...faker.helpers.multiple(response, { count: 2 })]
}
responses = _.keyBy(responses, 'uuid')

// Users
let users = faker.helpers.multiple(User.generate, { count: 20 })
users = _.keyBy([user, ...users], 'uuid')

// Generate date files
generateDataFile('.data/batches.json', batches)
generateDataFile('.data/campaigns.json', campaigns)
generateDataFile('.data/patients.json', patients)
generateDataFile('.data/records.json', records)
generateDataFile('.data/responses.json', responses)
generateDataFile('.data/sessions.json', sessions)
generateDataFile('.data/users.json', users)
