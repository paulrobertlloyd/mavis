import { fakerEN_GB as faker } from '@faker-js/faker'
import registrars from '../datasets/professional-bodies.js'

/**
 * Get registrar items parameters for `radios` or `checkboxes`
 * @returns {object} `items`
 */
export const getRegistrarItems = () => {
  return Object.entries(registrars).map(([key, value]) => ({
    text: value.name,
    value: key
  }))
}

/**
 * Get registration number using format for a given registrar
 * @param {string} registrarId - Registrar ID
 * @returns {string} Registration number
 */
export const getRegistrationNumber = (registrarId) => {
  return faker.helpers.replaceSymbols(
    registrars[registrarId].registrationFormat
  )
}
