import { fakerEN_GB as faker } from '@faker-js/faker'
import firstNames from '../datasets/first-names.js'
import gpSurgeries from '../datasets/gp-surgeries.js'

/**
 * @class Child Health Information Service (CHIS) record
 * @property {string} nhsNumber - NHS number
 * @property {string} firstName - First/given name
 * @property {string} lastName - Last/family name
 * @property {string} dob - Date of birth
 * @property {string} sex - Sex
 * @property {object} address - Address
 * @property {string} gpSurgery - GP surgery
 * @function age - Age in years
 * @function dobWithAge - Date of birth with age in brackets
 * @function fullName - Get full name
 * @function formattedAddress - Get full address, with line breaks
 * @function formattedNhsNumber - Get formatted NHS number
 * @function ns - Namespace
 * @function uri - URL
 */
export class Record {
  constructor(options) {
    this.nhsNumber = options?.nhsNumber || this.#nhsNumber
    this.firstName = options.firstName
    this.lastName = options.lastName
    this.dob = options.dob
    this.sex = options.sex
    this.address = options.address
    this.gpSurgery = options.gpSurgery
  }

  static generate() {
    const sex = faker.helpers.arrayElement(['Male', 'Female'])
    const firstName = faker.helpers.arrayElement(firstNames[sex.toLowerCase()])
    const lastName = faker.person.lastName()

    return new Record({
      firstName,
      lastName,
      dob: faker.date.birthdate({ min: 2010, max: 2018 }),
      sex,
      address: {
        addressLine1: faker.location.streetAddress(),
        addressLevel1: faker.location.city(),
        postalCode: faker.location.zipCode()
      },
      gpSurgery: faker.helpers.arrayElement(gpSurgeries)
    })
  }

  #nhsNumber = '999#######'.replace(/#+/g, (m) =>
    faker.string.numeric(m.length)
  )

  get age() {
    return Math.floor((new Date() - new Date(this.dob).getTime()) / 3.15576e10)
  }

  get dobWithAge() {
    const dob = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'long'
    }).format(new Date(this.dob))

    return `${dob} (aged ${this.age})`
  }

  get fullName() {
    return [this.firstName, this.lastName].join(' ')
  }

  get formattedNhsNumber() {
    const numberArray = this.nhsNumber.split('')
    numberArray.splice(3, 0, ' ')
    numberArray.splice(8, 0, ' ')
    return numberArray.join('')
  }

  get formattedAddress() {
    return Object.values(this.address).join('\n')
  }

  get ns() {
    return 'record'
  }

  get uri() {
    return `/records/${this.nhsNumber}`
  }
}
