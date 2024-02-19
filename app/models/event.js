import { fakerEN_GB as faker } from '@faker-js/faker'

export const TYPE = [
  'SELECT',
  'INVITE',
  'CONSENT',
  'SCREEN',
  'CAPTURE',
  'RECORD'
]

/**
 * @class Audit event
 * @property {string} uuid - UUID
 * @property {string} date - Creation date
 * @property {string} type - Activity type
 * @property {string} name - Name
 * @property {string} [note] - Notes
 * @property {string} user_uuid - User UUID
 * @function ns - Namespace
 * @function uri - URL
 */
export class Event {
  constructor(options) {
    this.uuid = options.uuid || faker.string.uuid()
    this.date = options.date || new Date().toISOString()
    this.type = options.type
    this.name = options.name
    this.note = options.note
    this.user_uuid = options.user_uuid
  }

  get formattedDate() {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'long'
    }).format(new Date(this.date))
  }

  get ns() {
    return 'event'
  }

  get uri() {
    return `/events/${this.uuid}`
  }
}
