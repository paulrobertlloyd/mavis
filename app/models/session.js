import { fakerEN_GB as faker } from '@faker-js/faker'
import campaigns from '../datasets/campaigns.js'
import schools from '../datasets/schools.js'
import {
  convertIsoDateToObject,
  convertObjectToIsoDate
} from '../utils/date.js'

/**
 * @class Session
 * @property {string} id - ID
 * @property {string} format - Format
 * @property {string} urn - School
 * @property {object} date - Date
 * @property {string} time - Time of day
 * @property {object} open - Date consent window opens
 * @property {number} reminder - Date to send reminders
 * @property {object} close - Date consent window closes
 * @property {string} campaign_type - Campaign type
 * @function uri - Session URL
 */
export class Session {
  constructor(options) {
    this.id = options?.id || faker.helpers.replaceSymbols('??##')
    this.format = options.format
    this.urn = options.urn
    this.date = options.date
    this.time = options.time
    this.open = options.open
    this.reminder = options.reminder
    this.close = options.close
    this.campaign_type = options.campaign_type
  }

  static generate() {
    const campaign_type = faker.helpers.arrayElement(['flu', 'hpv'])

    // Flu campaigns take place in primary schools, other campaigns in secondary
    let school = faker.helpers.arrayElement(schools)
    if (campaign_type === 'flu') {
      const primary = schools.filter((item) => item.phase === 'Primary')
      school = faker.helpers.arrayElement(primary)
    } else {
      const secondary = schools.filter((item) => item.phase === 'Secondary')
      school = faker.helpers.arrayElement(secondary)
    }

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
      format: faker.helpers.arrayElement([
        'A routine session in school',
        'A catch-up session in school',
        'A clinic'
      ]),
      urn: school.urn,
      date,
      time: faker.helpers.arrayElement(['Morning', 'Afternoon', 'All day']),
      open: new Date(open).toISOString(),
      reminder: new Date(reminder).toISOString(),
      close: new Date(close).toISOString(),
      campaign_type
    })
  }

  get name() {
    return `${campaigns[this.campaign_type].name} session at ${this.location.name}`
  }

  get school() {
    return schools.find((school) => school.urn === this.urn)
  }

  get location() {
    return {
      name: this.school.name,
      addressLine1: this.school.address_line1,
      addressLine2: this.school.address_line2,
      addressLevel1: this.school.address_level1,
      postalCode: this.school.postal_code
    }
  }

  get dateDate() {
    return convertIsoDateToObject(this.date)
  }

  set dateDate(object) {
    this.date = convertObjectToIsoDate(object)
  }

  get openDate() {
    return convertIsoDateToObject(this.open)
  }

  set openDate(object) {
    this.open = convertObjectToIsoDate(object)
  }

  get reminderDate() {
    return convertIsoDateToObject(this.reminder)
  }

  set reminderDate(object) {
    this.reminder = convertObjectToIsoDate(object)
  }

  get closeDate() {
    return convertIsoDateToObject(this.close)
  }

  set closeDate(object) {
    this.close = convertObjectToIsoDate(object)
  }

  get cohort() {
    return campaigns[this.campaign_type].cohort || []
  }

  get ns() {
    return 'session'
  }

  get uri() {
    return `/sessions/${this.id}`
  }
}
