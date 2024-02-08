import _ from 'lodash'
import { faker } from '@faker-js/faker'
import { Batch } from '../app/models/batch.js'
import { User } from '../app/models/user.js'
import { generateDataFile } from './generate-data-file.js'

// Batch
const batches = _.keyBy(
  faker.helpers.multiple(Batch.generate, { count: 20 }),
  'id'
)

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
generateDataFile('.data/users.json', users)
