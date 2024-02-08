import _ from 'lodash'
import { faker } from '@faker-js/faker'
import { User } from '../app/models/user.js'
import { generateDataFile } from './generate-data-file.js'

// Users
const users = _.keyBy(
  faker.helpers.multiple(User.generate, { count: 20 }),
  'uuid'
)

// Generate date files
generateDataFile('.data/users.json', users)
