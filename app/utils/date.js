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
