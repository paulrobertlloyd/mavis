import _ from 'lodash'
import { faker } from '@faker-js/faker'
import { User } from '../app/models/user.js'
import { generateDataFile } from './generate-data-file.js'

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
generateDataFile('.data/users.json', users)
