import { ConsentOutcome, ScreenOutcome } from '../models/patient.js'
import { getEnumKeyAndValue } from './enum.js'
import { getRepliesWithHealthAnswers } from './reply.js'

export const getScreenOutcome = (patient) => {
  if (patient.consent.value !== ConsentOutcome.Given) {
    return
  }

  const replies = Object.values(patient.replies)
  const repliesToTriage = getRepliesWithHealthAnswers(replies)

  if (repliesToTriage.length === 0) {
    return false
  }

  if (repliesToTriage.length > 0) {
    return getEnumKeyAndValue(ScreenOutcome, ScreenOutcome.NeedsTriage)
  }
}
