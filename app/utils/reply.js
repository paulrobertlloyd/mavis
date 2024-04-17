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
 * @param {import('../models/patient.js').Patient} patient - Patient
 * @param {string} key - Health question key
 * @returns {string|boolean} Health answer, or `false`
 */
const enrichWithRealisticAnswer = (patient, key) => {
  const condition = faker.helpers.objectKey(healthConditions)
  const useAnswer = faker.helpers.maybe(() => true, { probability: 0.2 })

  if (healthConditions[condition][key] && useAnswer) {
    return healthConditions[condition][key]
  }

  return false
}

/**
 * Get formatted health answer
 * @param {object} reply - Consent response
 * @param {string} id - Question ID
 * @param {string} [relationship] - Reply relationship
 * @returns {string} Answer to health question
 */
export const formattedHealthAnswer = (reply, id, relationship) => {
  const healthAnswer = reply.healthAnswers[id]
  if (relationship) {
    return !healthAnswer
      ? `<p>${relationship} responded: No</p>`
      : `<p>${relationship} responded: Yes:</p>\n<blockquote>${healthAnswer}</blockquote>`
  }

  return !healthAnswer
    ? '<p>No</p>'
    : `<p>Yes</p>\n<blockquote>${healthAnswer}</blockquote>`
}

/**
 * Get consent responses with answers to health questions
 * @param {Array} replies - Consent responses
 * @returns {Array} Consent responses with answers to health questions
 */
export function getRepliesWithHealthAnswers(replies) {
  replies = Array.isArray(replies) ? replies : [replies]

  return replies.filter((reply) => {
    for (const key in reply.healthAnswers) {
      if (
        reply.healthAnswers.hasOwnProperty(key) &&
        reply.healthAnswers[key] !== false
      ) {
        return reply.healthAnswers[key]
      }
    }
  })
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
 * @param {import('../models/patient.js').Patient} patient - Patient
 * @returns {object} Health answers
 */
export const getHealthAnswers = (type, patient) => {
  const answers = {}

  for (const key of campaignTypes[type].healthQuestions) {
    answers[key] = enrichWithRealisticAnswer(patient, key)
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
