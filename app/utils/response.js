import { faker } from '@faker-js/faker'
import campaignTypes from '../datasets/campaign-types.js'
import healthConditions from '../datasets/health-conditions.js'
import { Child } from '../models/child.js'
import { ResponseRefusal } from '../models/response.js'

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
  const answers = {}

  for (const key of campaignTypes[type].healthQuestions) {
    answers[key] = enrichWithRealisticAnswer(key)
  }

  return answers
}

/**
 * Get child’s preferred names, based on information in consent responses
 * @param {Array<Responses>} Responses - Consent responses
 * @returns {string|boolean} Names(s)
 */
export const getPreferredNames = (responses) => {
  const names = []

  responses.map((response) => {
    const child = new Child(response.child)
    if (child.preferredName) {
      names.push(child.preferredName)
    }
  })

  return names.length ? [...new Set(names)].join(', ') : false
}

/**
 * Get valid refusal reasons for a campaign
 * @param {string} type - Campaign type
 * @returns {string} Refusal reason
 */
export const getRefusalReason = (type) => {
  // Gelatine content only a valid refusal reason for flu vaccine
  const refusalReasons = Object.keys(ResponseRefusal).filter((key) =>
    type !== 'flu' ? key !== 'Gelatine' : key
  )

  return faker.helpers.arrayElement(refusalReasons)
}
