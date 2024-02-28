import { fakerEN_GB as faker } from '@faker-js/faker'
import { getHealthAnswers, getRefusalReason } from '../utils/response.js'
import { Child } from './child.js'
import { Parent } from './parent.js'

export const RESPONSE_DECISION = {
  GIVEN: 'Consent given',
  REFUSED: 'Consent refused',
  INVALID: 'Consent invalid',
  ONLY_MENACWY: 'Consent given for MenACWY only',
  ONLY_3_IN_1: 'Consent given for 3-in-1 only'
}

export const RESPONSE_METHOD = {
  WEBSITE: 'Online',
  PHONE: 'By phone',
  PAPER: 'Paper form'
}

export const RESPONSE_REFUSAL = {
  GELATINE: 'Vaccine contains gelatine',
  ALREADY_GIVEN: 'Vaccine already received',
  GETTING_ELSEWHERE: 'Vaccine will be given elsewhere',
  MEDICAL: 'Medical reasons',
  PERSONAL: 'Personal choice',
  OTHER: 'Other'
}

/**
 * @class Response
 * @property {string} uuid - UUID
 * @property {string} created - Created date
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
    this.created = options.created || new Date().toISOString()
    this.child = options.child
    this.parent = options.parent
    this.decision = options.decision
    this.method = options.method
    this.healthAnswers = options?.healthAnswers
    this.refusalReason = options?.refusalReason
    this.refusalReasonOther = options?.refusalReasonOther
  }

  static generate(campaign, patient) {
    const child = Child.generate(patient)
    const parent = Parent.generate(patient.record.lastName)
    const decision = faker.helpers.weightedArrayElement([
      { value: RESPONSE_DECISION.GIVEN, weight: 2 },
      { value: RESPONSE_DECISION.REFUSED, weight: 1 }
    ])
    const method = faker.helpers.weightedArrayElement([
      { value: RESPONSE_METHOD.WEBSITE, weight: 5 },
      { value: RESPONSE_METHOD.PHONE, weight: 1 },
      { value: RESPONSE_METHOD.PAPER, weight: 1 }
    ])

    const healthAnswers = getHealthAnswers(campaign.type)
    const refusalReason = getRefusalReason(campaign.type)

    return new Response({
      created: faker.date.recent({ days: 30 }),
      child,
      parent,
      decision,
      method,
      ...(decision === RESPONSE_DECISION.GIVEN && { healthAnswers }),
      ...(decision === RESPONSE_DECISION.REFUSED && {
        refusalReason,
        ...(refusalReason === RESPONSE_REFUSAL.OTHER && {
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
