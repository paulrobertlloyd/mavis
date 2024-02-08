import { fakerEN_GB as faker } from '@faker-js/faker'
import {
  convertIsoDateToObject,
  convertObjectToIsoDate
} from '../utils/date.js'

/**
 * @class Batch
 * @property {string} id - Batch ID
 * @property {string} entered - Entered into system
 * @property {string} expires - Expiry date
 * @property {string} vaccine_gtin - Vaccine GTIN
 * @function uri - Batch URL
 */
export class Batch {
  constructor(options) {
    this.id = options?.id || faker.helpers.replaceSymbols('??####')
    this.entered = options.entered || new Date().toISOString()
    this.expires = options.expires
    this.vaccine_gtin = options.vaccine_gtin
  }

  static generate() {
    return new Batch({
      entered: faker.date.recent({ days: 70 }),
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

  get expiresDate() {
    return convertIsoDateToObject(this.expires)
  }

  set expiresDate(object) {
    this.expires = convertObjectToIsoDate(object)
  }

  get ns() {
    return 'batch'
  }

  get uri() {
    return `/vaccines/${this.vaccine_gtin}/${this.id}`
  }
}
