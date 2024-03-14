import EventEmitter from 'node:events'
import { fakerEN_GB as faker } from '@faker-js/faker'
import { Event } from './event.js'
import { Record } from './record.js'
import { getConsentOutcome, getPreferredNames } from '../utils/response.js'

export class ConsentOutcome {
  static NoResponse = 'No response'
  static Inconsistent = 'Conflicts'
  static Given = 'Given'
  static Refused = 'Refused'
  // static FinalRefusal = 'Refusal confirmed'
}

export class ScreenOutcome {
  static NeedsTriage = 'Needs triage'
  static DelayVaccination = 'Delay vaccination to a later date'
  static DoNotVaccinate = 'Do not vaccinate in campaign'
  static Vaccinate = 'Safe to vaccinate'
}

export class CaptureOutcome {
  static Vaccinated = 'Vaccinated'
  static PartVaccinated = 'Partially vaccinated'
  static AlreadyVaccinated = 'Already had the vaccine'
  static Contraindications = 'Had contraindications'
  static Refused = 'Refused vaccine'
  static AbsentSchool = 'Absent from school'
  static AbsentSession = 'Absent from the session'
  static Unwell = 'Unwell'
  static NoConsent = 'Unable to contact parent'
  static LateConsent = 'Consent received too late'
}

export class GillickCompetent {
  static Yes = 'Yes, they are Gillick competent'
  static No = 'No'
}

export class PatientOutcome {
  static NoOutcomeYet = 'No outcome yet'
  static Vaccinated = 'Vaccinated'
  static CouldNotVaccinate = 'Could not vaccinate'
}

export const PatientEvents = new EventEmitter()

/**
 * @class Patient in-session record
 * @property {string} nhsn - NHS number
 * @property {Array} log - Audit log
 * @property {Array} responses - Consent responses
 * @property {ScreenOutcome} screen - Screening outcome
 * @property {CaptureOutcome} capture - Vaccination outcome
 * @property {PatientOutcome} outcome - Overall outcome
 * @property {Record} record - Original CHIS record
 * @property {object} [gillick] - Gillick
 * @property {GillickCompetent} [gillick.competence] - Gillick competence
 * @property {string} [gillick.assessment] - Gillick assessment
 * @property {string} [campaign_uuid] - Campaign UUID
 * @property {string} [session_id] - Session ID
 * @function consent - Consent outcome
 * @function preferredNames - Preferred name(s)
 * @function ns - Namespace
 * @function uri - URL
 */
export class Patient {
  constructor(options) {
    this.nhsn = options?.nhsn || this.#nhsn
    this.log = options?.log || []
    this.responses = options?.responses || []
    this.screen = options?.screen || false
    this.capture = options?.capture || false
    this.outcome = options?.outcome || 'NoOutcomeYet'
    this.record = new Record(options.record)
    this.gillick = options?.gillick || {}
    this.campaign_uuid = options.campaign_uuid
    this.session_id = options.session_id
  }

  static generate(record) {
    return new Patient({
      nhsn: record.nhsn,
      record
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
    return getConsentOutcome(this.responses)
  }

  get preferredNames() {
    return getPreferredNames(this.responses)
  }

  get ns() {
    return 'patient'
  }

  get uri() {
    return `/patients/${this.nhsn}`
  }

  set addEvent(event) {
    this.log.push(new Event(event))
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
    this.responses.push(response)
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
