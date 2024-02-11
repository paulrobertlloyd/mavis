import prototypeFilters from '@x-govuk/govuk-prototype-filters'

/**
 * Prototype specific filters for use in Nunjucks templates.
 * @param {object} env - Nunjucks environment
 * @returns {object} Filters
 */
export default (env) => {
  const filters = {}

  /**
   * Format date with day of the week
   * @param {string} string - ISO date, for example 07-12-2021
   * @returns {string} Formatted date, for example Sunday, 7 December 2021
   */
  filters.dateWithDayOfWeek = (string) => {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full'
    }).format(new Date(string))
  }

  /**
   * Format markdown
   * @param {string} string - Markdown
   * @returns {string} HTML decorated with nhsuk-* typography classes
   */
  filters.nhsukMarkdown = (string) => {
    const markdown = prototypeFilters.govukMarkdown(string)
    const nhsukMarkdown = markdown.replaceAll('govuk-', 'nhsuk-')
    return env.filters.safe(nhsukMarkdown)
  }

  /**
   * Push item to array
   * @param {Array} array - Array
   * @param {*} item - Item to push
   * @returns {Array} Updated array
   */
  filters.push = (array, item) => {
    let newArray = [...array]
    newArray.push(structuredClone(item))

    return newArray
  }

  return filters
}
