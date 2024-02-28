import { fakerEN_GB as faker } from '@faker-js/faker'
import { Event } from './event.js'
import { Record } from './record.js'
import { getConsentOutcome } from '../utils/consent.js'

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
 * @property {string} screen - Screening outcome
 * @property {string} capture - Vaccination outcome
 * @property {string} outcome - Overall outcome
 * @property {Array} log - Audit log
 * @property {object} chis_record - CHIS record
 * @property {string} [campaign_uuid] - Campaign UUID
 * @property {string} [session_id] - Session ID
 * @property {Array} [response_uuid] - Consent response UUID
 * @function consent - Consent outcome
 * @function record - Get full CHIS record
 * @function ns - Namespace
 * @function uri - URL
 */
export class Patient {
  constructor(options, data) {
    this.nhsn = options?.nhsn || this.#nhsn
    this.screen = options.screen
    this.capture = options.capture
    this.outcome = options.outcome
    this.log = options.log || []
    this.chis_record = options.chis_record
    this.campaign_uuid = options.campaign_uuid
    this.session_id = options.session_id
    this.response_uuid = options.response_uuid || []
    this.data = data
  }

  static generate(chis_record) {
    return new Patient({
      nhsn: chis_record.nhsn,
      screen: false,
      capture: false,
      outcome: 'NO_OUTCOME_YET',
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

  get consent() {
    return getConsentOutcome(this)
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

  attachCampaign(campaign, user) {
    this.campaign_uuid = campaign.uuid
    this.log.push(
      new Event({
        type: 'SELECT',
        name: `Added to ${campaign.name} campaign cohort`,
        date: campaign.created,
        user_uuid: user.uuid
      })
    )
  }

  attachSession(session, user) {
    this.session_id = session.id
    this.log.push(
      new Event({
        type: 'SELECT',
        name: `Added to session at ${session.location.name}`,
        date: session.created,
        user_uuid: user.uuid
      })
    )
  }

  attachResponse(response, user) {
    this.response_uuid.push(response.uuid)
    this.log.push(
      new Event({
        type: 'CONSENT',
        name: `Response ${response.decision} from ${response.parent.fullName}`,
        date: response.created,
        user_uuid: user?.uuid
      })
    )
  }
}
