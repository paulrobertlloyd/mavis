import { fakerEN_GB as faker } from '@faker-js/faker'
import { getHealthAnswers, getRefusalReason } from '../utils/reply.js'
import { Child } from './child.js'
import { Parent } from './parent.js'

export class ReplyDecision {
  static Given = 'Consent given'
  static Refused = 'Consent refused'
  static Invalid = 'Consent invalid'
  static OnlyMenACWY = 'Consent given for MenACWY only'
  static Only3in1 = 'Consent given for 3-in-1 only'
}

export class ReplyMethod {
  static Website = 'Online'
  static Phone = 'By phone'
  static Paper = 'Paper form'
  static InPerson = 'In person'
}

export class ReplyRefusal {
  static Gelatine = 'Vaccine contains gelatine'
  static AlreadyGiven = 'Vaccine already received'
  static GettingElsewhere = 'Vaccine will be given elsewhere'
  static Medical = 'Medical reasons'
  static Personal = 'Personal choice'
  static Other = 'Other'
}

/**
 * @class Reply
 * @property {string} uuid - UUID
 * @property {string} created - Created date
 * @property {object<Child>} child - Child
 * @property {object<Parent>} parent - Parent or guardian
 * @property {ReplyDecision} decision - Consent decision
 * @property {ReplyMethod} method - Reply method
 * @property {object} [healthAnswers] - Answers to health questions
 * @property {ReplyRefusal} [refusalReason] - Refusal reason
 * @property {string} [refusalReasonOther] - Other refusal reason
 * @property {string} patient_nhsn - Patient NHS number
 * @property {string} session_id - Session ID
 * @function ns - Namespace
 * @function uri - URL
 */
export class Reply {
  constructor(options) {
    this.uuid = options?.uuid || faker.string.uuid()
    this.created = options?.created || new Date().toISOString()
    this.child = options?.child && new Child(options.child)
    this.parent = options?.parent && new Parent(options.parent)
    this.decision = options?.decision
    this.method = options?.method
    this.healthAnswers = options?.healthAnswers
    this.refusalReason = options?.refusalReason
    this.refusalReasonOther = options?.refusalReasonOther
    this.patient_nhsn = options?.patient_nhsn
    this.session_id = options?.session_id
  }

  static generate(campaign, session, patient) {
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

    return new Reply({
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
      patient_nhsn: patient.nhsn,
      session_id: session.id
    })
  }

  get fullName() {
    console.log('get fullName')
    if (this.parent) {
      console.log('parent')
      return this.parent.fullName
    } else if (this.child) {
      console.log('child')
      return this.child.fullName
    }
  }

  get ns() {
    return 'reply'
  }

  get uri() {
    return `/sessions/${this.session_id}/${this.patient_nhsn}/replies/${this.uuid}`
  }
}
