import { isAfter, isBefore } from 'date-fns'
import { ConsentWindow } from '../models/session.js'
import { getEnumKeyAndValue } from './enum.js'

export const getConsentWindow = (session) => {
  const today = new Date()

  switch (true) {
    // Opening (open date is after today)
    case isAfter(session.open, today):
      return getEnumKeyAndValue(ConsentWindow, ConsentWindow.Opening)
    // Open (open date is before today, and close date after today)
    case isBefore(session.open, today) && isAfter(session.close, today):
      return getEnumKeyAndValue(ConsentWindow, ConsentWindow.Open)
    // Closed (close date is before today)
    case isBefore(session.close, today):
      return getEnumKeyAndValue(ConsentWindow, ConsentWindow.Closed)
    default:
      return getEnumKeyAndValue(ConsentWindow, ConsentWindow.None)
  }
}
