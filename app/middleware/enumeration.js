import { HealthQuestion } from '../models/campaign.js'
import { EventType } from '../models/event.js'
import {
  CaptureOutcome,
  ConsentOutcome,
  PatientOutcome,
  ScreenOutcome
} from '../models/patient.js'
import { SessionFormat, SessionTime } from '../models/session.js'
import { Registrar } from '../models/user.js'

export const enumeration = (request, response, next) => {
  response.locals.CaptureOutcome = CaptureOutcome
  response.locals.ConsentOutcome = ConsentOutcome
  response.locals.EventType = EventType
  response.locals.HealthQuestion = HealthQuestion
  response.locals.PatientOutcome = PatientOutcome
  response.locals.Registrar = Registrar
  response.locals.ScreenOutcome = ScreenOutcome
  response.locals.SessionFormat = SessionFormat
  response.locals.SessionTime = SessionTime

  next()
}
