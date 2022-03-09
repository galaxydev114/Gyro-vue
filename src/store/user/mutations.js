export const setUser = (state, user) => {
  state.currentUser = user
}

export const setCollaborator = (state, collaborator) => {
  state.collaborator = collaborator
}

export const setUsers = (state, users) => {
  state.users = users
}

export const setSkillsPriorityArray = (state, skillsPriorityArray) => {
  state.skillsPriorityArray = skillsPriorityArray
}

export const setGoalsObject = (state, goalsObject) => {
  state.goalsObject = goalsObject
}

export const setToolsArray = (state, toolsArray) => {
  state.toolsArray = toolsArray
}
export const setTechniquesArray = (state, techniquesArray) => {
  state.techniquesArray = techniquesArray
}

export const setHoursPlayADay = (state, hoursPlayADay) => {
  state.hoursPlayADay = hoursPlayADay
}
export const setHoursSleepingADay = (state, hoursSleepingADay) => {
  state.hoursSleepingADay = hoursSleepingADay
}

export const setDaysAvailableArray = (state, daysAvailableArray) => {
  state.daysAvailableArray = daysAvailableArray
}

export const setTimeInADayArray = (state, timeInADayArray) => {
  state.timeInADayArray = timeInADayArray
}

export const setScheduleTrainingPlan = (state, scheduleTrainingPlan) => {
  state.preferenceScheduleTrainingPlan = scheduleTrainingPlan
}

export const setUserPreferences = (state, userPreferences) => {
  state.skillsPriorityArray = userPreferences.preferences
  state.toolsArray = userPreferences.tools
  state.techniquesArray = userPreferences.techniques
  state.hoursSleepingADay = userPreferences.sleepingRoutine
  state.daysAvailableArray = userPreferences.trainingDays
  state.hoursPlayADay = userPreferences.trainingHours
  state.timeInADayArray = userPreferences.usuallyPlay
  state.preferenceScheduleTrainingPlan = userPreferences.weekCalendarPreferences
  state.completedOnboarding = userPreferences.isCompleted
}

export const setUserCompletedOnboarding = (state, completedOnboarding) => {
  state.completedOnboarding = completedOnboarding
}

export const setUserScore = (state, score) => {
  state.score = {
    ...score
  }
}

export const setUserPaymentPref = (state, paymentPref = {}) => {
  state.paymentPref = paymentPref
}

export const setUserActivitiesStats = (state, activitiesStats = {}) => {
  state.activitiesStats = activitiesStats
}

export const setTrainingPlansAmount = (state, amount) => {
  state.trainingPlansAmount = amount
}
