import { GPRegistered } from './record.js'
import {
  convertIsoDateToObject,
  convertObjectToIsoDate
} from '../utils/date.js'

/**
 * @class Child
 * @property {string} nhsn - NHS number
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} [preferredFirstName] - Preferred first name
 * @property {string} [preferredLastName] - Preferred last name
 * @property {string} dob - Date of birth
 * @property {object} [address] - Address
 * @property {GPRegistered} [gpRegistered] - Registered with a GP
 * @property {string} [gpSurgery] - GP surgery
 * @property {string} [urn] - School
 * @function fullName - Get full name
 * @function ns - Namespace
 * @function uri - URL
 */
export class Child {
  constructor(options) {
    this.nhsn = options.nhsn
    this.firstName = options.firstName || ''
    this.lastName = options.lastName || ''
    this.preferredFirstName = options?.preferredFirstName
    this.preferredLastName = options?.preferredLastName
    this.dob = options.dob || ''
    this.address = options?.address
    this.gpRegistered = options?.gpRegistered
    this.gpSurgery = options?.gpSurgery
    this.urn = options?.urn
    // dateInput objects
    this.dob_ = options?.dob_
  }

  static generate(patient) {
    let preferredFirstName
    if (patient.record.firstName.startsWith('Al')) {
      preferredFirstName = 'Ali'
    }
    if (patient.record.firstName.startsWith('Em')) {
      preferredFirstName = 'Em'
    }
    if (patient.record.firstName.startsWith('Isa')) {
      preferredFirstName = 'Izzy'
    }

    return new Child({
      nhsn: patient.record.nhsn,
      firstName: patient.record.firstName,
      preferredFirstName,
      lastName: patient.record.lastName,
      dob: patient.record.dob,
      address: patient.record.address,
      gpRegistered: patient.record.gpRegistered,
      gpSurgery: patient.record.gpSurgery,
      urn: patient.record.urn
    })
  }

  get dob_() {
    if (this.dob) {
      return convertIsoDateToObject(this.dob)
    }
  }

  set dob_(object) {
    if (object) {
      this.dob = convertObjectToIsoDate(object)
    }
  }

  get formattedDob() {
    if (!this.dob) return ''

    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'long'
    }).format(new Date(this.dob))
  }

  get age() {
    return Math.floor((new Date() - new Date(this.dob).getTime()) / 3.15576e10)
  }

  get dobWithAge() {
    return `${this.formattedDob} (aged ${this.age})`
  }

  get fullName() {
    if (!this.firstName || !this.lastName) return ''

    return [this.firstName, this.lastName].join(' ')
  }

  get preferredName() {
    const firstName = this.preferredFirstName || this.firstName
    const lastName = this.preferredLastName || this.lastName

    if (!firstName || !lastName) return

    if (this.preferredFirstName || this.preferredLastName) {
      return [firstName, lastName].join(' ')
    }
  }

  get fullAndPreferredNames() {
    return this.preferredName
      ? `${this.fullName} (known as ${this.preferredName})`
      : this.fullName
  }

  get formattedAddress() {
    if (!this.address) return

    if (Object.values(this.address).every((value) => value === '')) return ''

    return Object.values(this.address).join('\n')
  }

  get formattedGpSurgery() {
    if (!this.gpRegistered) return

    return this.gpRegistered === GPRegistered.Yes
      ? this.gpSurgery
      : this.gpRegistered
  }

  get ns() {
    return 'child'
  }

  get uri() {
    return `/children/${this.uuid}`
  }
}
