import _ from 'lodash'
import { Response } from './models/response.js'

/**
 * Prototype specific global functions for use in Nunjucks templates.
 * @returns {object} Globals
 */
export default () => {
  const globals = {}

  /**
   * Format link
   * @param {string} href - Hyperlink reference
   * @param {string} text - Hyperlink text
   * @returns {string} HTML anchor decorated with nhsuk-link class
   */
  globals.link = function (href, text) {
    return `<a class="nhsuk-link" href="${href}">${text}</a>`
  }

  globals.patientResponses = function (response_uuid) {
    const { data } = this.ctx

    const responses = []
    for (const uuid of response_uuid) {
      const response = new Response(data.responses[uuid])
      responses.push(response)
    }

    return responses
  }

  globals.patientStatus = function (patient) {
    const { __ } = this.ctx

    let colour
    let description = false
    let label

    if (patient.outcome !== 'NO_OUTCOME_YET') {
      // Patient has outcome
      colour = __(`outcome.${patient.outcome}.colour`)
      label = __(`outcome.${patient.outcome}.label`)
    } else if (patient.screen && this.consent === 'GIVEN') {
      // Patient in triage
      colour = __(`screen.${patient.screen}.colour`)
      description = __(`screen.${patient.screen}.description`)
      label = __(`screen.${patient.screen}.label`)
    } else {
      // Patient requires consent
      colour = __(`consent.${patient.consent}.colour`)
      description = __(
        `consent.${patient.consent}.description`,
        patient.record.fullName
      )
      label = __(`consent.${patient.consent}.label`)
    }

    return { colour, description, label }
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
      const value = rows[key].value || data[key]

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
