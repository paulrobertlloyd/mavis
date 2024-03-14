import { Campaign } from '../models/campaign.js'
import { Event } from '../models/event.js'
import { Patient, ConsentOutcome } from '../models/patient.js'
import { Reply } from '../models/reply.js'
import { Session } from '../models/session.js'
import { User } from '../models/user.js'

export const patientController = {
  read(request, response, next) {
    const { id, nhsn } = request.params
    const { data } = request.session

    const patient = new Patient(data.patients[nhsn])
    const replies = Object.values(patient.replies)
    const session = new Session(data.sessions[id])

    response.locals.campaign = new Campaign(
      data.campaigns[session.campaign_uuid]
    )
    response.locals.patient = patient
    response.locals.replies = replies.map((reply) => new Reply(reply))
    response.locals.session = session

    next()
  },

  show(request, response) {
    const { activity } = request.query
    const { campaign, patient, session } = response.locals

    const showGillick =
      patient.consent.value !== ConsentOutcome.Given && campaign.type === 'hpv'

    response.render('patient/show', {
      activity,
      paths: { back: `${session.uri}/${activity}` },
      showGillick
    })
  },

  log(request, response) {
    const { activity } = request.query
    const { data } = request.session
    const { patient, session } = response.locals

    response.render('patient/log', {
      activity,
      paths: { back: `${session.uri}/${activity}` },
      log: Object.values(patient.log)
        .map((event) => ({
          ...new Event(event),
          formattedDate: new Event(event).formattedDate,
          ...(event.user_uuid && {
            user: new User(data.users[event.user_uuid])
          })
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    })
  }
}
