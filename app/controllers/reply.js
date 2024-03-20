import { wizard } from 'nhsuk-prototype-rig'
import { Parent, ParentalRelationship } from '../models/parent.js'
import { Patient } from '../models/patient.js'
import { Reply, ReplyDecision } from '../models/reply.js'

export const replyController = {
  read(request, response, next) {
    const { uuid } = request.params
    const { patient } = response.locals

    const reply = patient.replies.find((reply) => reply.uuid === uuid)
    response.locals.reply = new Reply(reply)

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

    delete data.wizard

    const reply = new Reply({
      child: patient.record,
      patient_nhsn: patient.nhsn,
      session_id: session.id
    })

    data.wizard = reply

    response.redirect(
      `/sessions/${id}/${nhsn}/replies/${reply.uuid}/new/person`
    )
  },

  update(request, response) {
    const { form, id, nhsn, uuid } = request.params
    const { data } = request.session
    const { __, reply, patient } = response.locals

    patient.reply = new Reply({
      ...reply, // Previous values
      ...data.wizard // Wizard values
    })

    delete data.wizard

    const action = form === 'edit' ? 'update' : 'create'
    request.flash(
      'success',
      __(`reply.success.${action}`, patient.reply.fullName)
    )
    response.redirect(`/sessions/${id}/${nhsn}/replies/${uuid}`)
  },

  readForm(request, response, next) {
    const { form, id, uuid, nhsn } = request.params
    const { data } = request.session

    const journey = {
      [`/`]: {},
      [`/${uuid}/${form}/person`]: {},
      [`/${uuid}/${form}/method`]: {},
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
        [`/${uuid}/${form}/check-answers`]: true
      },
      [`/${uuid}/${form}/refusal-reason`]: {
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

    response.locals.decisionItems = [
      {
        text: 'Yes',
        value: 'Given'
      },
      {
        text: 'No',
        value: 'Refused'
      }
    ]

    const patient = new Patient(data.patients[nhsn])

    const { lastName } = patient.record

    const exampleParents = (response.locals.exampleParents = {
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
    })

    response.locals.personItems = [
      {
        text: exampleParents.a.fullName,
        value: 'a',
        hint: {
          text: exampleParents.a.relationship
        }
      },
      {
        text: exampleParents.b.fullName,
        value: 'b',
        hint: {
          text: exampleParents.b.relationship
        }
      },
      ...(patient?.gillick?.competence === 'Yes'
        ? [
            {
              text: patient.record.fullName,
              value: 'self',
              hint: {
                text: 'Child (assessed as Gillick competent)'
              },
              value: 'self'
            }
          ]
        : [])
    ]

    response.locals.reply = new Reply({
      ...(form === 'edit' && reply), // Previous values
      ...data.wizard // Wizard values,
    })

    next()
  },

  showForm(request, response) {
    const { view } = request.params

    response.render(`reply/form/${view}`)
  },

  updateForm(request, response) {
    const { data } = request.session
    const { exampleParents, paths, reply } = response.locals

    // If example parent selected, add parent to reply
    if (data.person === 'a' || data.person === 'b') {
      reply.parent = exampleParents[data.person]
      delete data.person
    }

    // TODO: Replace '' with `false`
    delete data.healthAnswers

    // TODO: Indicate self consent

    data.wizard = new Reply({
      ...reply, // Previous values
      ...request.body.reply // New value
    })

    response.redirect(paths.next)
  }
}
