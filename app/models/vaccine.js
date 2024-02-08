import { fakerEN_GB as faker } from '@faker-js/faker'

/**
 * @class Vaccine
 * @property {string} gtin - GTIN
 * @property {string} type - Type
 * @property {string} name - Name
 * @property {string} brand - Brand
 * @property {string} supplier - Supplier
 * @property {string} method - Method
 * @property {number} dose - Dosage
 * @function brandWithName - Get brand with vaccine type
 * @function ns - Namespace
 * @function uri - URL
 */
export class Vaccine {
  constructor(options) {
    this.gtin = options?.gtin || faker.string.numeric(14)
    this.type = options.type
    this.name = options.name
    this.brand = options.brand
    this.supplier = options.supplier
    this.method = options.method
    this.dose = options?.dose
  }

  get brandWithName() {
    return `${this.brand} (${this.name})`
  }

  get ns() {
    return 'vaccine'
  }

  get uri() {
    return `/vaccines/${this.gtin}`
  }
}
