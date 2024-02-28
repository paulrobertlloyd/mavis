import _ from 'lodash'
import { faker } from '@faker-js/faker'
import campaignTypes from '../datasets/campaign-types.js'
import healthConditions from '../datasets/health-conditions.js'
import { Child } from '../models/child.js'
import { ConsentOutcome } from '../models/patient.js'
import { ReplyDecision, ReplyRefusal } from '../models/reply.js'
import { getEnumKeyAndValue } from './enum.js'

/**
 * Add example answers to health questions
 * @param {string} key - Health question key
 * @returns {string|boolean} Health answer, or `false`
 */
const enrichWithRealisticAnswer = (key) => {
  const condition = faker.helpers.objectKey(healthConditions)
  const useAnswer = faker.helpers.maybe(() => true, { probability: 0.2 })

  if (healthConditions[condition][key] && useAnswer) {
    return healthConditions[condition][key]
  }

  return false
}

/**
 * Get consent outcome
 * @param {Array<import('../models/reply.js').Reply>} replies - Consent replies
 * @returns {string} Consent outcome
 */
export const getConsentOutcome = (replies) => {
  replies = Object.values(replies)

  if (replies?.length === 1) {
    // Reply decision value matches consent outcome key
    const { key } = getEnumKeyAndValue(ReplyDecision, replies[0].decision)
    return getEnumKeyAndValue(ConsentOutcome, key)
  } else if (replies?.length > 1) {
    const decisions = _.uniqBy(replies, 'decision')
    if (decisions.length > 1) {
      return getEnumKeyAndValue(ConsentOutcome, ConsentOutcome.Inconsistent)
    } else if (decisions[0].decision === ReplyDecision.Given) {
      return getEnumKeyAndValue(ConsentOutcome, ConsentOutcome.Given)
    } else if (decisions[0].decision === ReplyDecision.Refused) {
      return getEnumKeyAndValue(ConsentOutcome, ConsentOutcome.Refused)
    }
  } else {
    return getEnumKeyAndValue(ConsentOutcome, ConsentOutcome.NoResponse)
  }

  return
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
 * Get child’s preferred names, based on information in consent replies
 * @param {Array<import('../models/reply.js').Reply>} replies - Consent replies
 * @returns {string|boolean} Names(s)
 */
export const getPreferredNames = (replies) => {
  const names = []

  Object.values(replies).map((reply) => {
    const child = new Child(reply.child)
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
  const refusalReasons = Object.keys(ReplyRefusal).filter((key) =>
    type !== 'flu' ? key !== 'Gelatine' : key
  )

  return faker.helpers.arrayElement(refusalReasons)
}
