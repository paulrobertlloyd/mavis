import _ from 'lodash'
import { faker } from '@faker-js/faker'
import campaignTypes from '../app/datasets/campaign-types.js'
import { Batch } from '../app/models/batch.js'
import { Campaign } from '../app/models/campaign.js'
import { Patient } from '../app/models/patient.js'
import { Record } from '../app/models/record.js'
import { Response } from '../app/models/response.js'
import { Session } from '../app/models/session.js'
import { User } from '../app/models/user.js'
import { getCohortFromAgeRange } from '../app/utils/cohort.js'
import { generateDataFile } from './generate-data-file.js'

const createCohort = (type) => {
  const { minAge, maxAge } = campaignTypes[type]
  return getCohortFromAgeRange(records, minAge, maxAge)
}

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
const batches = faker.helpers.multiple(Batch.generate, { count: 20 })

// Records
const records = faker.helpers.multiple(Record.generate, { count: 50 })

// Cohorts
const fluCohort = createCohort('flu')
const hpvCohort = createCohort('hpv')
const tioCohort = createCohort('3-in-1-men-acwy')

// Campaigns
const campaigns = [
  Campaign.generate('flu', fluCohort),
  Campaign.generate('hpv', hpvCohort),
  Campaign.generate('3-in-1-men-acwy', tioCohort)
]

// Patients
// Create patient records and attach them with a campaign
let patients = []
for (const campaign of campaigns) {
  for (const nhsn of campaign.cohort) {
    const record = records.find((record) => record.nhsn === nhsn)

    const patient = Patient.generate(record)
    patient.attachCampaign(campaign, user)

    patients.push(patient)
  }
}

// Sessions
// Create sessions and attach them to patients
let sessions = []
const schools = Object.groupBy(patients, ({ record }) => record.urn)
for (const [urn, patients] of Object.entries(schools)) {
  const { campaign_uuid } = patients[0]
  const campaign = Object.values(campaigns).find(
    (campaign) => campaign.uuid === campaign_uuid
  )

  const cohort = Object.values(patients).map((record) => record.nhsn)
  const session = Session.generate(urn, cohort, campaign)

  for (const patient of patients) {
    patient.attachSession(session, user)
  }

  sessions.push(session)
}

// Responses
let responses = []
for (const patient of patients) {
  const campaign = Object.values(campaigns).find(
    (campaign) => campaign.uuid === patient.campaign_uuid
  )
  const response = () => ({ ...Response.generate(campaign, patient) })
  const responses = faker.helpers.multiple(response, { min: 0, max: 3 })

  for (const response of responses) {
    patient.attachResponse(response)
  }
}

// Users
let users = faker.helpers.multiple(User.generate, { count: 20 })
users = [user, ...users]

// Generate date files
generateDataFile('.data/batches.json', _.keyBy(batches, 'id'))
generateDataFile('.data/campaigns.json', _.keyBy(campaigns, 'uuid'))
generateDataFile('.data/patients.json', _.keyBy(patients, 'nhsn'))
generateDataFile('.data/records.json', _.keyBy(records, 'nhsn'))
generateDataFile('.data/responses.json', _.keyBy(responses, 'uuid'))
generateDataFile('.data/sessions.json', _.keyBy(sessions, 'id'))
generateDataFile('.data/users.json', _.keyBy(users, 'uuid'))
