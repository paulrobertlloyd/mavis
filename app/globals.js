import _ from 'lodash'
import { HealthQuestion } from './models/campaign.js'
import { ConsentOutcome, Patient, PatientOutcome } from './models/patient.js'
import { getEnumKeyAndValue } from './utils/enum.js'
import {
  getRepliesWithHealthAnswers,
  formattedHealthAnswer
} from './utils/reply.js'

/**
 * Prototype specific global functions for use in Nunjucks templates.
 * @returns {object} Globals
 */
export default () => {
  const globals = {}

  /**
   * Get form field items for a given Enum
   * @param {Enum} Enum - Enumerable name
   * @returns {object} Form field items
   */
  globals.enumItems = function (Enum) {
    return Object.entries(Enum).map(([, value]) => ({
      text: value,
      value
    }))
  }

  globals.enumKeyAndValue = getEnumKeyAndValue

  /**
   * Get health answer summary list rows
   * @param {object} campaign - Campaign
   * @param {Array} replies - Consent responses
   * @returns {Array|undefined} Parameters for summary list component
   */
  globals.healthAnswerRows = function (campaign, replies) {
    if (replies.length === 0) {
      return
    }

    const rows = []
    for (const id of campaign.healthQuestions) {
      const repliesWithAnswers = getRepliesWithHealthAnswers(replies)
      const uniqueReplies = _.uniqBy(repliesWithAnswers, `healthAnswers[${id}]`)

      let html
      if (replies.length > 1) {
        const answers = []
        for (const reply of uniqueReplies) {
          const relationship =
            uniqueReplies.length > 1 ? reply.relationship : 'All'

          answers.push(formattedHealthAnswer(reply, id, relationship))
        }
        html = answers.join('\n')
      } else {
        html = formattedHealthAnswer(replies[0], id)
      }

      rows.push({
        key: { text: HealthQuestion[id] },
        value: { html }
      })
    }

    return rows
  }

  /**
   * Format link
   * @param {string} href - Hyperlink reference
   * @param {string} text - Hyperlink text
   * @returns {string} HTML anchor decorated with nhsuk-link class
   */
  globals.link = function (href, text) {
    return `<a class="nhsuk-link" href="${href}">${text}</a>`
  }

  globals.sessionPatients = function (cohort) {
    const { data } = this.ctx

    const patients = []
    for (const nhsn of cohort) {
      const patient = new Patient(data.patients[nhsn])
      patients.push(patient)
    }

    return patients
  }

  globals.patientStatus = function (patient) {
    const { __ } = this.ctx

    let colour
    let description = false
    let title

    if (patient.outcome !== PatientOutcome.NoOutcomeYet) {
      // Patient has outcome
      colour = __(`outcome.${patient.outcome}.colour`)
      title = __(`outcome.${patient.outcome}.title`)
    } else if (
      patient.screen &&
      patient.consent.value === ConsentOutcome.Given
    ) {
      // Patient in triage
      colour = __(`screen.${patient.screen}.colour`)
      description = __(`screen.${patient.screen}.description`)
      title = __(`screen.${patient.screen}.title`)
    } else {
      // Patient requires consent
      colour = __(`consent.${patient.consent.key}.colour`)
      description = __(
        `consent.${patient.consent.key}.description`,
        patient.record.fullName
      )
      title = __(`consent.${patient.consent.key}.title`)
    }

    return { colour, description, title }
  }

  /**
   * Session summary
   * @param {object} session - Session details
   * @returns {string} HTML paragraph
   */
  globals.sessionSummary = function (session) {
    return `<p class="nhsuk-u-margin-bottom-0 nhsuk-u-secondary-text-color">
      ${globals.link(session.uri, session.location.name)}</br>
      ${session.location.addressLine1},
      ${session.location.addressLevel1},
      ${session.location.postalCode}
    </p>`
  }

  /**
   * Get summaryList `rows` parameters
   * @param {object} data - Data
   * @param {object} rows - Row configuration
   * @returns {object} `rows`
   */
  globals.summaryRows = function (data, rows) {
    const { __ } = this.ctx
    const summaryRows = []

    for (const key in rows) {
      let other = rows[key].other
      let value = rows[key].value || data[key]
      value = other ? [value, other].join(' – ') : value

      // Don’t show row for conditional answer
      if (typeof value === 'undefined') {
        continue
      }

      const label = rows[key].label || __(`${data.ns}.${key}.label`)
      const changeLabel = _.lowerFirst(label)
      const href = rows[key].href
      const fallbackValue = href
        ? `<a href="${href}">Enter ${changeLabel}</a>`
        : 'Not provided'

      summaryRows.push({
        key: {
          text: label
        },
        value: {
          html: String(value) || fallbackValue
        },
        actions: href &&
          value && {
            items: [
              {
                href,
                text: 'Change',
                visuallyHiddenText: changeLabel
              }
            ]
          }
      })
    }

    return summaryRows
  }

  return globals
}
