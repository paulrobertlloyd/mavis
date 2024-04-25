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
    return getEnumKeyAndValue(ScreenOutcome, ScreenOutcome.Vaccinate)
  }

  if (repliesToTriage.length > 0) {
    const lastTriageNote = patient.triageNotes.at(-1)

    if (lastTriageNote) {
      return getEnumKeyAndValue(ScreenOutcome, lastTriageNote.info_.outcome)
    }

    return getEnumKeyAndValue(ScreenOutcome, ScreenOutcome.NeedsTriage)
  }
}
