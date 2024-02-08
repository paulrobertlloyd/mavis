import _ from 'lodash'

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
      const label = rows[key].label || __(`${data.ns}.${key}.label`)
      const changeLabel = _.lowerFirst(label)
      const href = rows[key].href
      const value = rows[key].value || data[key]
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
