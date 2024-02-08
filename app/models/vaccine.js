/**
 * @class Vaccine
 * @property {string} gtin - GTIN
 * @property {string} brand - Brand
 * @property {string} supplier - Supplier
 * @property {string} vaccine - Vaccine type
 * @property {string} method - Method
 * @property {number} dose - Dosage
 * @function uri - Vaccine URL
 */
export class Vaccine {
  constructor(options) {
    this.gtin = options?.gtin || faker.string.numeric(14)
    this.brand = options.brand
    this.supplier = options.supplier
    this.vaccine = options.vaccine
    this.method = options.method
    this.dose = options?.dose
  }

  get brandWithVaccine() {
    return `${this.brand} (${this.vaccine})`
  }

  get ns() {
    return 'vaccine'
  }

  get uri() {
    return `/vaccines/${this.gtin}`
  }
}
