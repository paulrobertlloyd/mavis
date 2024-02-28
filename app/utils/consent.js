import _ from 'lodash'

/**
 * Get consent outcome
 * @param {object<Patient>} Patient - patient
 * @returns {string} Consent outcome
 */
export const getConsentOutcome = (Patient) => {
  const responses = Object.values(Patient.data.responses).filter((response) => {
    return Patient.response_uuid.includes(response.uuid)
  })

  if (responses?.length === 1) {
    return responses[0].decision
  } else if (responses?.length > 1) {
    const decisions = _.uniqBy(responses, 'decision')

    if (decisions.length > 1) {
      if (decisions.find((response) => response.decision === 'FINAL_REFUSAL')) {
        return 'FINAL_REFUSAL'
      } else {
        return 'INCONSISTENT'
      }
    } else if (decisions[0].decision === 'GIVEN') {
      return 'GIVEN'
    } else if (decisions[0].decision === 'REFUSED') {
      return 'REFUSED'
    }
  } else {
    return 'NO_RESPONSE'
  }
}
