import _ from 'lodash'
import { faker } from '@faker-js/faker'
import { Batch } from '../app/models/batch.js'
import { Campaign } from '../app/models/campaign.js'
import { Patient } from '../app/models/patient.js'
import { Record } from '../app/models/record.js'
import { Session } from '../app/models/session.js'
import { User } from '../app/models/user.js'
import { generateDataFile } from './generate-data-file.js'

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

// Patients in-session
let patients = []
for (const record of Object.values(records)) {
  patients = [...patients, Patient.generate(record)]
}
patients = _.keyBy(patients, 'nhsn')

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

// Users
const adminUser = new User({
  admin: true,
  email: 'jane.joy@nhs.net',
  firstName: 'Jane',
  lastName: 'Joy',
  registrar: 'gmc',
  registration: '7233456'
})

const exampleUsers = faker.helpers.multiple(User.generate, { count: 20 })

const users = _.keyBy([adminUser, ...exampleUsers], 'uuid')

// Generate date files
generateDataFile('.data/batches.json', batches)
generateDataFile('.data/campaigns.json', campaigns)
generateDataFile('.data/patients.json', patients)
generateDataFile('.data/records.json', records)
generateDataFile('.data/sessions.json', sessions)
generateDataFile('.data/users.json', users)
