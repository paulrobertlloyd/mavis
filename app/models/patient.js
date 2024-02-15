import { fakerEN_GB as faker } from '@faker-js/faker'
import { Record } from './record.js'

export const CONSENT_OUTCOME = [
  'NO_RESPONSE',
  'GIVEN',
  'REFUSED',
  'FINAL_REFUSAL',
  'INCONSISTENT'
]

export const SCREEN_OUTCOME = [
  'NEEDS_TRIAGE',
  'DELAY_VACCINATION',
  'DO_NOT_VACCINATE',
  'VACCINATE'
]

export const CAPTURE_OUTCOME = [
  'VACCINATED',
  'PART_VACCINATED',
  'ALREADY_VACCINATED',
  'CONTRAINDICATIONS',
  'REFUSED',
  'ABSENT_SCHOOL',
  'ABSENT_SESSION',
  'UNWELL',
  'NO_CONSENT',
  'LATE_CONSENT'
]

export const OUTCOME = ['NO_OUTCOME_YET', 'VACCINATED', 'COULD_NOT_VACCINATE']

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
    const consent = faker.helpers.arrayElement(CONSENT_OUTCOME)
    const outcome = 'NO_OUTCOME_YET'

    return new Patient({
      nhsn: chis_record.nhsn,
      consent,
      screen: false,
      capture: false,
      outcome,
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
