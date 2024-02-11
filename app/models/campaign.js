import { fakerEN_GB as faker } from '@faker-js/faker'
import campaignTypes from '../datasets/campaign-types.js'

export class HealthQuestion {
  static Aspirin = 'Does the child take regular aspirin?'
  static Allergy = 'Does the child have any severe allergies?'
  static Asthma = 'Has the child been diagnosed with asthma?'
  static AsthmaAdmitted =
    'Has the child been admitted to intensive care for their asthma?'
  static AsthmaSteroids =
    'Has the child taken any oral steroids for their asthma in the last 2 weeks?'
  static EggAllergy =
    'Has the child ever been admitted to intensive care due an allergic reaction to egg?'
  static Immunosuppressant =
    'Does the child take any immunosuppressant medication?'
  static ImmuneSystem =
    'Does the child have a disease or treatment that severely affects their immune system?'
  static HouseholdImmuneSystem =
    'Is anyone in the child’s household currently having treatment that severely affects their immune system?'
  static MedicationAllergies =
    'Does the child have any allergies to medication?'
  static MedicalConditions =
    'Does the child have any medical conditions for which they receive treatment?'
  static PreviousReaction =
    'Has the child ever had a severe reaction to any medicines, including vaccines?'
  static RecentFluVaccination =
    'Has the child had a flu vaccination in the last 5 months?'
}

/**
 * @class Campaign
 * @property {string} uuid - UUID
 * @property {string} created - Created date
 * @property {string} [created_user_uuid] - User who created campaign
 * @property {string} type - Campaign type
 * @property {string} name - Campaign name
 * @property {Array<HealthQuestion>} healthQuestions - Health questions
 * @property {Array} cohort - Cohort
 * @property {Array} vaccines - Vaccines administered
 * @function ns - Namespace
 * @function uri - URL
 */
export class Campaign {
  constructor(options) {
    this.uuid = options.uuid || faker.string.uuid()
    this.created = options.created || new Date().toISOString()
    this.created_user_uuid = options?.created_user_uuid
    this.type = options.type
    this.name = options.name
    this.cohort = options.cohort
    this.healthQuestions = options.healthQuestions
    this.vaccines = options.vaccines
  }

  static generate(type, cohort, user) {
    // Ensure cohort only contains unique values
    cohort = [...new Set(cohort)]

    return new Campaign({
      type,
      created: faker.date.recent({ days: 90 }),
      created_user_uuid: user.uuid,
      name: campaignTypes[type].name,
      cohort,
      healthQuestions: campaignTypes[type].healthQuestions,
      vaccines: campaignTypes[type].vaccines
    })
  }

  get ns() {
    return 'campaign'
  }

  get uri() {
    return `/campaigns/${this.uuid}`
  }
}
