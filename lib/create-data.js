import _ from 'lodash'
import { faker } from '@faker-js/faker'
import exampleUsers from '../app/datasets/users.js'
import { Batch } from '../app/models/batch.js'
import { Campaign } from '../app/models/campaign.js'
import { Patient } from '../app/models/patient.js'
import { Record } from '../app/models/record.js'
import { Reply } from '../app/models/reply.js'
import { Session } from '../app/models/session.js'
import { User } from '../app/models/user.js'
import { createCohort } from '../app/utils/cohort.js'
import { generateDataFile, range } from './generate-data-file.js'

// Example admin user
const exampleUser = new User(exampleUsers[0])

// Batch
const batches = faker.helpers.multiple(Batch.generate, { count: 20 })

// Records
const records = faker.helpers.multiple(Record.generate, { count: 400 })

// Campaigns
const campaigns = [
  Campaign.generate('flu', createCohort('flu', records), exampleUser),
  Campaign.generate('hpv', createCohort('hpv', records), exampleUser),
  Campaign.generate(
    '3-in-1-men-acwy',
    createCohort('3-in-1-men-acwy', records),
    exampleUser
  )
]

// Patients
// Create patient records and attach them with a campaign
let patients = []
for (const campaign of campaigns) {
  for (const nhsn of campaign.cohort) {
    const record = records.find((record) => record.nhsn === nhsn)
    const patient = Patient.generate(record)
    patient.campaign = campaign
    patients.push(patient)
  }
}

// Sessions
let sessions = []
const schools = Object.groupBy(patients, ({ record }) => record.urn)
for (const [urn, patients] of Object.entries(schools)) {
  let session

  for (const campaign of campaigns) {
    // Create session
    session = Session.generate(urn, campaign, exampleUser)

    const patientsInCampaign = Object.values(patients).filter(
      (patient) => patient.campaign_uuid === campaign.uuid
    )

    // Update patients in campaign
    for (const patient of patientsInCampaign) {
      patient.session = session
      sessions.push(session)

      // Add replies to patient
      const hasReplies = faker.datatype.boolean(0.8)
      if (hasReplies) {
        const replyCount = faker.helpers.weightedArrayElement([
          { value: 0, weight: 0.3 },
          { value: 1, weight: 0.6 },
          { value: 2, weight: 0.1 }
        ])
        for (const _index in [...range(0, replyCount)]) {
          patient.reply = Reply.generate(campaign, session, patient)
        }
      }
    }
  }
}

// Users
let users = faker.helpers.multiple(User.generate, { count: 20 })
users = [exampleUser, ...users]

// Generate date files
generateDataFile('.data/batches.json', _.keyBy(batches, 'id'))
generateDataFile('.data/campaigns.json', _.keyBy(campaigns, 'uuid'))
generateDataFile('.data/patients.json', _.keyBy(patients, 'nhsn'))
generateDataFile('.data/records.json', _.keyBy(records, 'nhsn'))
generateDataFile('.data/sessions.json', _.keyBy(sessions, 'id'))
generateDataFile('.data/users.json', _.keyBy(users, 'uuid'))
