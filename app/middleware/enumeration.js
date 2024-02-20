import { HealthQuestion } from '../models/campaign.js'
import { EventType } from '../models/event.js'
import { ContactPreference, ParentalRelationship } from '../models/parent.js'
import {
  CaptureOutcome,
  ConsentOutcome,
  PatientOutcome,
  ScreenOutcome
} from '../models/patient.js'
import { ReplyDecision, ReplyMethod, ReplyRefusal } from '../models/reply.js'
import { SessionFormat, SessionTime } from '../models/session.js'
import { Registrar } from '../models/user.js'

export const enumeration = (request, response, next) => {
  response.locals.CaptureOutcome = CaptureOutcome
  response.locals.ConsentOutcome = ConsentOutcome
  response.locals.ContactPreference = ContactPreference
  response.locals.EventType = EventType
  response.locals.HealthQuestion = HealthQuestion
  response.locals.ParentalRelationship = ParentalRelationship
  response.locals.PatientOutcome = PatientOutcome
  response.locals.Registrar = Registrar
  response.locals.ReplyDecision = ReplyDecision
  response.locals.ReplyMethod = ReplyMethod
  response.locals.ReplyRefusal = ReplyRefusal
  response.locals.ScreenOutcome = ScreenOutcome
  response.locals.SessionFormat = SessionFormat
  response.locals.SessionTime = SessionTime

  next()
}
