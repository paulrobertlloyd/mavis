import {
  ConsentOutcome,
  PatientOutcome,
  TriageOutcome
} from '../models/patient.js'
import { RegistrationOutcome } from '../models/registration.js'
import { Vaccination, VaccinationOutcome } from '../models/vaccination.js'
import { getEnumKeyAndValue } from './enum.js'

/**
 * Get patient outcome
 * @param {import('../models/patient.js').Patient} patient - Patient
 * @returns {string} Patient outcome
 */
export const getPatientOutcome = (patient) => {
  const vaccinations = Object.values(patient.vaccinations).map(
    (vaccination) => new Vaccination(vaccination)
  )

  if (vaccinations.length === 1) {
    if (
      vaccinations[0].outcome === VaccinationOutcome.Vaccinated ||
      vaccinations[0].outcome === VaccinationOutcome.PartVaccinated ||
      vaccinations[0].outcome === VaccinationOutcome.AlreadyVaccinated
    ) {
      return getEnumKeyAndValue(PatientOutcome, PatientOutcome.Vaccinated)
    } else {
      return getEnumKeyAndValue(
        PatientOutcome,
        PatientOutcome.CouldNotVaccinate
      )
    }
  }

  return getEnumKeyAndValue(PatientOutcome, PatientOutcome.NoOutcomeYet)
}

/**
 * Get registration outcome (has the patient been checked into the session)
 * @param {import('../models/patient.js').Patient} patient - Patient
 * @returns {object} Outcome key and value
 */
export const getRegistrationOutcome = (patient) => {
  // Patients with an outcome have completed check-in and capture journey
  if (patient.outcome.value !== PatientOutcome.NoOutcomeYet) {
    return getEnumKeyAndValue(RegistrationOutcome, RegistrationOutcome.Pending)
  }

  if (patient.registered && patient.registered === true) {
    return getEnumKeyAndValue(RegistrationOutcome, RegistrationOutcome.Present)
  } else if (patient.registered === false) {
    return getEnumKeyAndValue(RegistrationOutcome, RegistrationOutcome.Absent)
  }

  return getEnumKeyAndValue(RegistrationOutcome, RegistrationOutcome.Pending)
}
