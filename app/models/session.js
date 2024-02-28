import { fakerEN_GB as faker } from '@faker-js/faker'
import schools from '../datasets/schools.js'
import {
  convertIsoDateToObject,
  convertObjectToIsoDate
} from '../utils/date.js'

/**
 * @class Session
 * @property {string} id - ID
 * @property {string} created - Created date
 * @property {Array} cohort - Cohort
 * @property {string} [format] - Format
 * @property {string} [urn] - School
 * @property {object} [date] - Date
 * @property {string} [time] - Time of day
 * @property {object} [open] - Date consent window opens
 * @property {number} [reminder] - Date to send reminders
 * @property {object} [close] - Date consent window closes
 * @property {string} [campaign_uuid] - Campaign UUID
 * @function school - Get school details
 * @function location - Get location details
 * @function ns - Namespace
 * @function uri - URL
 */
export class Session {
  constructor(options) {
    this.id = options?.id || faker.helpers.replaceSymbols('??##')
    this.created = options?.created || new Date().toISOString()
    this.cohort = options?.cohort || []
    this.format = options?.format
    this.urn = options?.urn
    this.date = options?.date
    this.time = options?.time
    this.open = options?.open
    this.reminder = options?.reminder
    this.close = options?.close
    this.campaign_uuid = options?.campaign_uuid
    // dateInput objects
    this.date_ = options?.date_
    this.open_ = options?.open_
    this.reminder_ = options?.reminder_
    this.close_ = options?.close_
  }

  static generate(urn, cohort, campaign) {
    const created = faker.date.recent({ days: 30 })

    const date = faker.date.soon({ days: 90 })

    // Open consent request window 60 days before session
    const open = new Date(date)
    open.setDate(open.getDate() - 60)

    // Send reminders 7 days after consent opens
    const reminder = new Date(open)
    reminder.setDate(reminder.getDate() + 7)

    // Close consent request window 3 days before session
    const close = new Date(date)
    close.setDate(close.getDate() - 3)

    return new Session({
      created,
      cohort,
      format: faker.helpers.arrayElement([
        'A routine session in school',
        'A catch-up session in school',
        'A clinic'
      ]),
      urn,
      date: date.toISOString(),
      time: faker.helpers.arrayElement(['Morning', 'Afternoon', 'All day']),
      open: new Date(open).toISOString(),
      reminder: new Date(reminder).toISOString(),
      close: new Date(close).toISOString(),
      campaign_uuid: campaign.uuid
    })
  }

  get date_() {
    return convertIsoDateToObject(this.date)
  }

  set date_(object) {
    if (object) {
      this.date = convertObjectToIsoDate(object)
    }
  }

  get open_() {
    return convertIsoDateToObject(this.open)
  }

  set open_(object) {
    if (object) {
      this.open = convertObjectToIsoDate(object)
    }
  }

  get reminder_() {
    return convertIsoDateToObject(this.reminder)
  }

  set reminder_(object) {
    if (object) {
      this.reminder = convertObjectToIsoDate(object)
    }
  }

  get close_() {
    return convertIsoDateToObject(this.close)
  }

  set close_(object) {
    if (object) {
      this.close = convertObjectToIsoDate(object)
    }
  }

  get school() {
    if (this.urn) {
      return schools[this.urn]
    }
  }

  get location() {
    if (this.school) {
      return {
        name: this.school.name,
        addressLine1: this.school.address_line1,
        addressLine2: this.school.address_line2,
        addressLevel1: this.school.address_level1,
        postalCode: this.school.postal_code
      }
    }
  }

  get ns() {
    return 'session'
  }

  get uri() {
    return `/sessions/${this.id}`
  }
}
