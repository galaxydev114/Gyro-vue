export default {
  users: [],
  currentUser: null,
  collaborator: null,
  completedOnboarding: false,
  score: null,
  skillsPriorityArray: [], // ['aiming', 'building', ...]
  preferenceScheduleTrainingPlan: [], // ['aiming', 'building', ...]
  techniquesArray: [],
  toolsArray: [],
  goalsObject: {},
  hoursPlayADay: null,
  hoursSleepingADay: null,
  daysAvailableArray: [], // Numbers Array Monday = 1
  timeInADayArray: [], // String Array
  paymentPref: {},
  activitiesStats: {},
  trainingPlansAmount: 0,
  maxScores: {
    maxKD: 10,
    maxPR: 250000
  },
  discordData: null,
  userFriendGroupApplication: null,
  userFriendGroup: null
}
