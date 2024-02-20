import { fakerEN_GB as faker } from '@faker-js/faker'
import { getHealthAnswers, getRefusalReason } from '../utils/response.js'
import { Child } from './child.js'
import { Parent } from './parent.js'

export class ResponseDecision {
  static Given = 'Consent given'
  static Refused = 'Consent refused'
  static Invalid = 'Consent invalid'
  static OnlyMenACWY = 'Consent given for MenACWY only'
  static Only3in1 = 'Consent given for 3-in-1 only'
}

export class ResponseMethod {
  static Website = 'Online'
  static Phone = 'By phone'
  static Paper = 'Paper form'
}

export class ResponseRefusal {
  static Gelatine = 'Vaccine contains gelatine'
  static AlreadyGiven = 'Vaccine already received'
  static GettingElsewhere = 'Vaccine will be given elsewhere'
  static Medical = 'Medical reasons'
  static Personal = 'Personal choice'
  static Other = 'Other'
}

/**
 * @class Response
 * @property {string} uuid - UUID
 * @property {string} created - Created date
 * @property {object<Child>} child - Child
 * @property {object<Parent>} parent - Parent or guardian
 * @property {ResponseDecision} decision - Consent decision
 * @property {ResponseMethod} method - Response method
 * @property {object} [healthAnswers] - Answers to health questions
 * @property {ResponseRefusal} [refusalReason] - Refusal reason
 * @property {string} [refusalReasonOther] - Other refusal reason
 * @property {string} patient_nhsn - Patient NHS number
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
    this.patient_nhsn = options.patient_nhsn
  }

  static generate(campaign, patient) {
    const child = Child.generate(patient)
    const parent = Parent.generate(patient.record.lastName)
    const decision = faker.helpers.weightedArrayElement([
      { value: 'Given', weight: 2 },
      { value: 'Refused', weight: 1 }
    ])
    const method = faker.helpers.weightedArrayElement([
      { value: 'Website', weight: 5 },
      { value: 'Phone', weight: 1 },
      { value: 'Paper', weight: 1 }
    ])

    const healthAnswers = getHealthAnswers(campaign.type)
    const refusalReason = getRefusalReason(campaign.type)

    return new Response({
      created: faker.date.recent({ days: 30 }),
      child,
      parent,
      decision,
      method,
      ...(decision === 'Given' && { healthAnswers }),
      ...(decision === 'Refused' && {
        refusalReason,
        ...(refusalReason === 'Other' && {
          refusalReasonOther: 'My family rejects vaccinations on principle.'
        })
      }),
      patient_nhsn: patient.nhsn
    })
  }

  get ns() {
    return 'response'
  }

  get uri() {
    return `/patients/${this.patient_nhsn}/responses/${this.uuid}`
  }
}
