import { HealthQuestion } from '../models/campaign.js'
import { SessionFormat, SessionTime, SessionStatus } from '../models/session.js'
import { Registrar } from '../models/user.js'

export const enumeration = (request, response, next) => {
  response.locals.HealthQuestion = HealthQuestion
  response.locals.Registrar = Registrar
  response.locals.SessionFormat = SessionFormat
  response.locals.SessionTime = SessionTime
  response.locals.SessionStatus = SessionStatus

  next()
}
