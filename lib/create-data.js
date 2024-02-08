import _ from 'lodash'
import { faker } from '@faker-js/faker'
import { User } from '../app/models/user.js'
import { generateDataFile } from './generate-data-file.js'

// Example admin user
const user = new User({
  admin: true,
  email: 'nurse.joy@example.com',
  firstName: 'Jane',
  lastName: 'Joy',
  registrar: 'GMC',
  registration: '7233456'
})

let users = faker.helpers.multiple(User.generate, { count: 20 })
users = [user, ...users]

// Generate date files
generateDataFile('.data/users.json', _.keyBy(users, 'uuid'))
