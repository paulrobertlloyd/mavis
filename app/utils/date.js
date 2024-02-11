import prototypeFilters from '@x-govuk/govuk-prototype-filters'

export const convertObjectToIsoDate = prototypeFilters.isoDateFromDateInput

/**
 * Convert ISO 8601 date to`items` object
 * @param {string} isoDate - ISO 8601 date
 * @returns {object} `items` for dateInput component
 */
export function convertIsoDateToObject(isoDate) {
  const dateObj = new Date(isoDate)

  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1,
    day: dateObj.getDate()
  }
}

/**
 * Add days to a date
 * @param {string} date - ISO 8601 date
 * @param {number} days - Number of days to add
 * @returns {Date} Date with days added
 */
export function addDays(date, days) {
  date = new Date(date)
  date.setDate(date.getDate() + days)

  return date
}

/**
 * Format a data
 * @param {string} string - Date string
 * @param {object} [options] - DateTimeFormat options
 * @returns {string} Formatted date
 */
export function formatDate(string, options) {
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(string))
}
