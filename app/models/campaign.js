import { fakerEN_GB as faker } from '@faker-js/faker'
import campaignTypes from '../datasets/campaign-types.js'

export class HealthQuestion {
  static Aspirin = 'Does your child take regular aspirin?'
  static Allergy = 'Does your child have any severe allergies?'
  static Asthma = 'Has your child been diagnosed with asthma?'
  static AsthmaAdmitted =
    'Has your child been admitted to intensive care for their asthma?'
  static AsthmaSteroids =
    'Has your child taken any oral steroids for their asthma in the last 2 weeks?'
  static EggAllergy =
    'Has your child ever been admitted to intensive care due an allergic reaction to egg?'
  static Immunosuppressant =
    'Does the child take any immunosuppressant medication?'
  static ImmuneSystem =
    'Does your child have a disease or treatment that severely affects their immune system?'
  static HouseholdImmuneSystem =
    'Is anyone in your household currently having treatment that severely affects their immune system?'
  static MedicationAllergies =
    'Does your child have any allergies to medication?'
  static MedicalConditions =
    'Does your child have any medical conditions for which they receive treatment?'
  static PreviousReaction =
    'Has your child ever had a severe reaction to any medicines, including vaccines?'
  static RecentFluVaccination =
    'Has your child had a flu vaccination in the last 5 months?'
}

/**
 * @class Campaign
 * @property {string} uuid - UUID
 * @property {string} created - Created date
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
    this.type = options.type
    this.name = options.name
    this.cohort = options.cohort
    this.healthQuestions = options.healthQuestions
    this.vaccines = options.vaccines
  }

  static generate(type, cohort) {
    // Ensure cohort only contains unique values
    cohort = [...new Set(cohort)]

    return new Campaign({
      type,
      created: faker.date.recent({ days: 90 }),
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
