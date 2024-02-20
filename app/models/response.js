import { fakerEN_GB as faker } from '@faker-js/faker'
import { getHealthAnswers, getRefusalReason } from '../utils/response.js'
import { Child } from './child.js'
import { Parent } from './parent.js'

export const CONSENT = [
  'GIVEN',
  'REFUSED',
  'INVALID',
  'ONLY_MENACWY',
  'ONLY_3_IN_1'
]

export const REFUSAL = [
  'GELATINE',
  'ALREADY_GIVEN',
  'GETTING_ELSEWHERE',
  'MEDICAL',
  'PERSONAL',
  'OTHER'
]

/**
 * @class Response
 * @property {string} uuid - UUID
 * @property {string} date - Date
 * @property {object<Child>} child - Child
 * @property {object<Parent>} parent - Parent or guardian
 * @property {string} decision - Consent decision
 * @property {string} method - Response method
 * @property {object} [healthAnswers] - Answers to health questions
 * @property {string} [refusalReason] - Refusal reason
 * @property {string} [refusalReasonOther] - Other refusal reason
 * @function ns - Namespace
 * @function uri - URL
 */
export class Response {
  constructor(options) {
    this.uuid = options?.uuid || faker.string.uuid()
    this.date = options.date || new Date().toISOString()
    this.child = options.child
    this.parent = options.parent
    this.decision = options.decision
    this.method = options.method
    this.healthAnswers = options?.healthAnswers
    this.refusalReason = options?.refusalReason
    this.refusalReasonOther = options?.refusalReasonOther
  }

  static generate(campaign, session, patient) {
    const child = Child.generate(patient, session.urn)
    const parent = Parent.generate(patient.record.lastName)
    const decision = faker.helpers.weightedArrayElement([
      { value: 'GIVEN', weight: 2 },
      { value: 'REFUSED', weight: 1 }
    ])
    const method = faker.helpers.weightedArrayElement([
      { value: 'WEBSITE', weight: 5 },
      { value: 'CALL', weight: 1 },
      { value: 'PAPER', weight: 1 }
    ])

    const healthAnswers = getHealthAnswers(campaign.type)
    const refusalReason = getRefusalReason(campaign.type)

    return new Response({
      date: faker.date.recent({ days: 30 }),
      child,
      parent,
      decision,
      method,
      ...(decision === 'GIVEN' && { healthAnswers }),
      ...(decision === 'REFUSED' && {
        refusalReason,
        ...(refusalReason === 'OTHER' && {
          refusalReasonOther: 'My family rejects vaccinations on principle.'
        })
      })
    })
  }

  get ns() {
    return 'response'
  }

  get uri() {
    return `/responses/${this.uuid}`
  }
}
