import { fakerEN_GB as faker } from '@faker-js/faker'
import campaigns from '../datasets/campaigns.js'

/**
 * @class Campaign
 * @property {string} uuid - UUID
 * @property {string} type - Campaign type
 * @property {string} name - Name
 * @property {object} healthQuestions - Health questions
 * @property {Array} cohort - Cohort
 * @property {Array} vaccines - Vaccines administered
 * @function uri - Campaign URL
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
      name: `${campaigns[type].name} (Winter 2023/24)`,
      cohort: [],
      healthQuestions: campaigns[type].healthQuestions,
      vaccines: campaigns[type].vaccines
    })
  }

  get ns() {
    return 'campaign'
  }

  get uri() {
    return `/campaigns/${this.uuid}`
  }
}
