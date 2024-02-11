import { fakerEN_GB as faker } from '@faker-js/faker'
import campaignTypes from '../datasets/campaign-types.js'

/**
 * @class Campaign
 * @property {string} uuid - UUID
 * @property {string} type - Campaign type
 * @property {string} name - Campaign name
 * @property {object} healthQuestions - Health questions
 * @property {Array} cohort - Cohort
 * @property {Array} vaccines - Vaccines administered
 * @function ns - Namespace
 * @function uri - URL
 */
export class Campaign {
  constructor(options) {
    this.uuid = options?.uuid || faker.string.uuid()
    this.type = options.type
    this.name = options.name
    this.cohort = options.cohort
    this.healthQuestions = options.healthQuestions
    this.vaccines = options.vaccines
  }

  static generate(type) {
    return new Campaign({
      type,
      name: campaignTypes[type].name,
      cohort: [],
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
