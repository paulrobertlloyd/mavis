import { Campaign } from '../models/campaign.js'
import { Event, EventType } from '../models/event.js'
import { Patient, PatientEvents, ConsentOutcome } from '../models/patient.js'
import { Session } from '../models/session.js'
import { User } from '../models/user.js'

export const patientController = {
  read(request, response, next) {
    const { data } = request.session
    const user_uuid = data.token?.uuid || false

    PatientEvents.once('gillick:update', (patient) => {
      patient.addEvent = {
        type: EventType.Consent,
        name: `Completed Gillick assessment`,
        date: new Date().toISOString(),
        user_uuid
      }
    })

    next()
  },

  show(request, response) {
    const { id, nhsn } = request.params
    const { activity } = request.query
    const { data } = request.session

    const patient = new Patient(data.patients[nhsn])
    const session = new Session(data.sessions[id])
    const campaign = new Campaign(data.campaigns[session.campaign_uuid])

    const showGillick =
      patient.consent !== ConsentOutcome.Given && campaign.type === 'hpv'

    response.render('patient/show', {
      activity,
      paths: { back: `${session.uri}/${activity}` },
      patient,
      showGillick
    })
  },

  log(request, response) {
    const { id, nhsn } = request.params
    const { activity } = request.query
    const { data } = request.session

    const session = new Session(data.sessions[id])

    response.render('patient/log', {
      activity,
      paths: { back: `${session.uri}/${activity}` },
      patient: new Patient(data.patients[nhsn]),
      log: Object.values(data.patients[nhsn].log)
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
