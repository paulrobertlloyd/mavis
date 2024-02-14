const allergy = 'Does your child have any severe allergies?'
const medicalConditions =
  'Does your child have any medical conditions for which they receive treatment?'
const previousReaction =
  'Has your child ever had a severe reaction to any medicines, including vaccines?'

export default {
  flu: {
    type: 'flu',
    name: 'Flu',
    minAge: 4,
    maxAge: 11,
    vaccines: ['05000456078276', '5000123114115'],
    healthQuestions: {
      asthma: 'Has your child been diagnosed with asthma?',
      asthmaSteroids:
        'Has your child taken any oral steroids for their asthma in the last 2 weeks?',
      asthmaAdmitted:
        'Has your child been admitted to intensive care for their asthma?',
      recentFluVaccination:
        'Has your child had a flu vaccination in the last 5 months?',
      immuneSystem:
        'Does your child have a disease or treatment that severely affects their immune system?',
      householdImmuneSystem:
        'Is anyone in your household currently having treatment that severely affects their immune system?',
      eggAllergy:
        'Has your child ever been admitted to intensive care due an allergic reaction to egg?',
      medicationAllergies: 'Does your child have any allergies to medication?',
      previousReaction,
      aspirin: 'Does your child take regular aspirin?'
    }
  },
  hpv: {
    type: 'hpv',
    name: 'HPV',
    minAge: 12,
    maxAge: 14,
    vaccines: ['3664798042948'],
    healthQuestions: {
      allergy,
      medicalConditions,
      previousReaction
    }
  },
  '3-in-1-men-acwy': {
    type: '3-in-1-men-acwy',
    name: '3-in-1 teenage booster and MenACWY',
    minAge: 13,
    maxAge: 15,
    vaccines: ['3664798042948', '5415062370568'],
    healthQuestions: {
      allergy,
      medicalConditions,
      immunosuppressant: 'Does the child take any immunosuppressant medication?'
    }
  }
}
