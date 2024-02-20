import { faker } from '@faker-js/faker'
import campaignTypes from '../datasets/campaign-types.js'
import healthConditions from '../datasets/health-conditions.js'
import { REFUSAL } from '../models/response.js'

const enrichWithRealisticAnswer = (key) => {
  const condition = faker.helpers.objectKey(healthConditions)
  const useAnswer = faker.helpers.maybe(() => true, { probability: 0.2 })

  if (healthConditions[condition][key] && useAnswer) {
    return healthConditions[condition][key]
  }

  return false
}

/**
 * Get faked answers for health questions in a campaign
 * @param {string} type - Campaign type
 * @returns {object} Health answers
 */
export const getHealthAnswers = (type) => {
  const { healthQuestions } = campaignTypes[type]
  const answers = {}

  for (const key of Object.keys(healthQuestions)) {
    answers[key] = enrichWithRealisticAnswer(key)
  }

  return answers
}

/**
 * Get valid refusal reasons for a campaign
 * @param {string} type - Campaign type
 * @returns {string} Refusal reason
 */
export const getRefusalReason = (type) => {
  // Gelatine content only a valid refusal reason for flu vaccine
  const refusalReasons = Object.values(REFUSAL).filter((value) =>
    type !== 'flu' ? value !== REFUSAL.GELATINE : value
  )

  return faker.helpers.arrayElement(refusalReasons)
}
