import { wizard } from 'nhsuk-prototype-rig'
import { GillickCompetent } from '../models/gillick.js'
import { Parent, ParentalRelationship } from '../models/parent.js'
import { Patient } from '../models/patient.js'
import { Reply, ReplyDecision, ReplyRefusal } from '../models/reply.js'

export const replyController = {
  read(request, response, next) {
    const { uuid } = request.params
    const { patient } = response.locals

    request.app.locals.reply = new Reply(patient.replies[uuid])

    next()
  },

  redirect(request, response) {
    const { id, nhsn } = request.params

    response.redirect(`/sessions/${id}/${nhsn}`)
  },

  show(request, response) {
    response.render('reply/show')
  },

  new(request, response) {
    const { id, nhsn } = request.params
    const { data } = request.session
    const { patient, session } = response.locals

    delete data.reply
    delete data.triage
    delete data.wizard

    const reply = new Reply({
      child: patient.record,
      patient_nhsn: patient.nhsn,
      session_id: session.id
    })

    data.wizard = reply

    request.app.locals.start =
      patient.gillick?.competence === GillickCompetent.Yes
        ? 'decision'
        : 'parent'

    response.redirect(
      `/sessions/${id}/${nhsn}/replies/${reply.uuid}/new/${request.app.locals.start}`
    )
  },

  update(request, response) {
    const { reply, triage } = request.app.locals
    const { form, id } = request.params
    const { data } = request.session
    const { __ } = response.locals
    const patient = new Patient(response.locals.patient)

    patient.respond = new Reply({
      ...reply, // Previous values
      ...data.wizard, // Wizard values
      ...(data.token && { created_user_uuid: data.token.uuid })
    })

    if (triage.outcome) {
      patient.triage = {
        ...triage,
        ...data.wizard, // Wizard values
        ...(data.token && { created_user_uuid: data.token.uuid })
      }
    }

    delete data.reply
    delete data.triage
    delete data.wizard
    delete request.app.locals.reply
    delete request.app.locals.triage

    const action = form === 'edit' ? 'update' : 'create'
    request.flash('success', __(`reply.success.${action}`, { reply, patient }))
    response.redirect(`/sessions/${id}/consent`)
  },

  readForm(request, response, next) {
    const { reply, start, triage } = request.app.locals
    const { form, id, uuid, nhsn } = request.params
    const { data } = request.session

    request.app.locals.reply = new Reply({
      ...(form === 'edit' && reply), // Previous values
      ...data.wizard // Wizard values,
    })

    request.app.locals.triage = {
      ...(form === 'edit' && triage), // Previous values
      ...data.wizard // Wizard values,
    }

    const replyNeedsTriage = (reply) => {
      return reply?.healthAnswers
        ? Object.values(reply.healthAnswers).find((answer) => answer !== '')
        : false
    }

    const journey = {
      [`/`]: {},
      ...(start === 'parent' && {
        [`/${uuid}/${form}/parent`]: {},
        [`/${uuid}/${form}/method`]: {}
      }),
      [`/${uuid}/${form}/decision`]: {
        [`/${uuid}/${form}/health-answers`]: {
          data: 'reply.decision',
          value: ReplyDecision.Given
        },
        [`/${uuid}/${form}/refusal-reason`]: {
          data: 'reply.decision',
          value: ReplyDecision.Refused
        }
      },
      [`/${uuid}/${form}/health-answers`]: {
        [`/${uuid}/${form}/${replyNeedsTriage(request.session.data.reply) ? 'triage' : 'check-answers'}`]: true
      },
      [`/${uuid}/${form}/refusal-reason`]: {
        [`/${uuid}/${form}/refusal-reason-details`]: {
          data: 'reply.refusalReason',
          values: [
            ReplyRefusal.AlreadyGiven,
            ReplyRefusal.GettingElsewhere,
            ReplyRefusal.Medical
          ]
        },
        [`/${uuid}/${form}/check-answers`]: true
      },
      [`/${uuid}/${form}/refusal-reason-details`]: {
        [`/${uuid}/${form}/check-answers`]: true
      },
      [`/${uuid}/${form}/triage`]: {
        [`/${uuid}/${form}/check-answers`]: true
      },
      [`/${uuid}`]: {}
    }

    response.locals.paths = {
      ...wizard(journey, request),
      ...(form === 'edit' && {
        back: `/sessions/${id}/${nhsn}/replies/${uuid}/edit`,
        next: `/sessions/${id}/${nhsn}/replies/${uuid}/edit`
      })
    }

    const patient = new Patient(data.patients[nhsn])
    const { lastName } = patient.record

    request.app.locals.parents = {
      a: new Parent({
        firstName: 'Anthony',
        lastName,
        fullName: `Anthony ${lastName}`,
        tel: '0117 123 4567',
        relationship: ParentalRelationship.Dad
      }),
      b: new Parent({
        firstName: 'Bethany',
        lastName,
        fullName: `Bethany ${lastName}`,
        tel: '0117 987 6543',
        relationship: ParentalRelationship.Mum
      })
    }

    const { parents } = request.app.locals
    response.locals.parentItems = [
      {
        text: parents.a.fullName,
        value: 'a',
        hint: {
          text: parents.a.relationship
        }
      },
      {
        text: parents.b.fullName,
        value: 'b',
        hint: {
          text: parents.b.relationship
        }
      }
    ]

    response.locals.childItems = [
      {
        text: 'Yes'
      },
      {
        text: 'No'
      }
    ]

    response.locals.decisionItems = [
      {
        text: 'Yes',
        value: ReplyDecision.Given
      },
      {
        text: 'No',
        value: ReplyDecision.Refused
      }
    ]

    next()
  },

  showForm(request, response) {
    const { view } = request.params

    response.render(`reply/form/${view}`)
  },

  updateForm(request, response) {
    const { parents, reply, triage } = request.app.locals
    const { data } = request.session
    const { paths } = response.locals

    // If parent selected, add parent to reply
    if (data.parent) {
      reply.parent = parents[data.parent]
      delete data.parent
    }

    delete data.healthAnswers

    data.wizard = {
      ...reply, // Previous reply values
      ...triage, // Previous triage values
      ...request.body.reply, // New reply value
      ...request.body.triage // New triage value
    }

    response.redirect(paths.next)
  }
}
