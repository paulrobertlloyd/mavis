import { fakerEN_GB as faker } from '@faker-js/faker'
import { Record } from './record.js'

/**
 * @class Patient in-session record
 * @property {string} nhsn - NHS number
 * @property {string} consent - Consent outcome
 * @property {string} screen - Screening outcome
 * @property {string} capture - Vaccination outcome
 * @property {string} outcome - Overall outcome
 * @property {Array} log - Audit log
 * @property {object} chis_record - CHIS record
 * @function record - Get full CHIS record
 * @function ns - Namespace
 * @function uri - URL
 */
export class Patient {
  constructor(options) {
    this.nhsn = options?.nhsn || this.#nhsn
    this.consent = options.consent
    this.screen = options.screen
    this.capture = options.capture
    this.outcome = options.outcome
    this.log = options.log || []
    this.chis_record = options.chis_record
  }

  static generate(chis_record) {
    return new Patient({
      nhsn: chis_record.nhsn,
      consent: false,
      screen: false,
      capture: false,
      outcome: false,
      log: [],
      chis_record
    })
  }

  #nhsn = '999#######'.replace(/#+/g, (m) => faker.string.numeric(m.length))

  get formattedNhsNumber() {
    const numberArray = this.nhsn.split('')
    numberArray.splice(3, 0, ' ')
    numberArray.splice(8, 0, ' ')
    return numberArray.join('')
  }

  get record() {
    return new Record(this.chis_record)
  }

  get ns() {
    return 'patient'
  }

  get uri() {
    return `/patients/${this.nhsn}`
  }
}
