import { fakerEN_GB as faker } from '@faker-js/faker'
import vaccines from '../datasets/vaccines.js'
import {
  convertIsoDateToObject,
  convertObjectToIsoDate
} from '../utils/date.js'

/**
 * @class Batch
 * @property {string} id - Batch ID
 * @property {string} created - Created date
 * @property {string} expires - Expiry date
 * @property {string} vaccine_gtin - Vaccine GTIN
 * @function vaccine - Vaccine
 * @function formattedCreated - Formatted created date
 * @function formattedExpires - Formatted expiry date
 * @function ns - Namespace
 * @function uri - URL
 */
export class Batch {
  constructor(options) {
    this.id = options?.id || faker.helpers.replaceSymbols('??####')
    this.created = options.created || new Date().toISOString()
    this.expires = options.expires
    this.vaccine_gtin = options.vaccine_gtin
    // dateInput objects
    this.expires_ = options?.expires_
  }

  static generate() {
    return new Batch({
      created: faker.date.recent({ days: 70 }),
      expires: faker.date.recent({ days: 50 }),
      vaccine_gtin: faker.helpers.arrayElement([
        '05000456078276', // Flu (Nasal)
        '5000123114115', // Flu (Injection)
        '00191778001693', // HPV
        '3664798042948', // 3-in-1
        '5415062370568' // MenACWY
      ])
    })
  }

  get expires_() {
    return convertIsoDateToObject(this.expires)
  }

  set expires_(object) {
    if (object) {
      this.expires = convertObjectToIsoDate(object)
    }
  }

  get formattedCreated() {
    return this.created
      ? new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'long'
        }).format(new Date(this.created))
      : false
  }

  get formattedExpires() {
    return this.expires
      ? new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'long'
        }).format(new Date(this.expires))
      : false
  }

  get vaccine() {
    return vaccines[this.vaccine_gtin]
  }

  get ns() {
    return 'batch'
  }

  get uri() {
    return `/vaccines/${this.vaccine_gtin}/${this.id}`
  }
}
