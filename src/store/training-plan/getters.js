import Vue from 'vue'

const aggregateTrainingDay = (day, routines) => {
  return day.map(routine => {
    const userTrainingRoutine = routines[routine.activityInstanceId]

    return {
      ...routine,
      ...userTrainingRoutine
    }
  })
}

const findRoutineInDay = (dayRoutines, routineId) => {
  return dayRoutines.find(day => day.activityInstanceId === routineId)
}

export const focus = (state) => (state.focus)

export const trainingDay1 = (state, getters, rootState) => aggregateTrainingDay(
  state.schedules[1].items,
  rootState?.trainingRoutine?.routines || {}
)

export const trainingDay2 = (state, getters, rootState) => aggregateTrainingDay(
  state.schedules[2].items,
  rootState?.trainingRoutine?.routines || {}
)

export const trainingDay3 = (state, getters, rootState) => aggregateTrainingDay(
  state.schedules[3].items,
  rootState?.trainingRoutine?.routines || {}
)

export const trainingDay4 = (state, getters, rootState) => aggregateTrainingDay(
  state.schedules[4].items,
  rootState?.trainingRoutine?.routines || {}
)

export const trainingDay5 = (state, getters, rootState) => aggregateTrainingDay(
  state.schedules[5].items,
  rootState?.trainingRoutine?.routines || {}
)

export const trainingDay6 = (state, getters, rootState) => aggregateTrainingDay(
  state.schedules[6].items,
  rootState?.trainingRoutine?.routines || {}
)

export const trainingDay7 = (state, getters, rootState) => aggregateTrainingDay(
  state.schedules[7].items,
  rootState?.trainingRoutine?.routines || {}
)

export const trainingDay = (state, getters, rootState) => (dayNumber) => aggregateTrainingDay(
  state.schedules[dayNumber].items,
  rootState?.trainingRoutine?.routines || {}
)

export const timeSectionsByDay = (state) => state.timeSectionsByDay

export const getTrainingPlanByRoutineId = (state) => (routineId) => {
  return Object.values(state.schedules)
    .map(schedule => schedule.items)
    .find(items => findRoutineInDay(items, routineId))
}

export const getTrainingPlansByDayId = (state) => (dayId) => {
  return state.schedules[dayId]?.items
}

export const showFinishedAllDailyRoutineModal = (state, getters, rootState, rootGetters) => {
  const finishedDailyRoutinesModal = localStorage.getItem('finishedDailyRoutinesModal')
  const currentDay = Vue.prototype.$date().format('DD/MM/YYYY')
  if (finishedDailyRoutinesModal !== currentDay && Vue.prototype.$date(state.startDate).format('DD/MM/YYYY') === currentDay) {
    const dayOfWeek = getters.trainingPlanOffsetDay
    const dailyRoutinesCompleted = getters.dailyRoutinesCompleted(dayOfWeek)
    if (dailyRoutinesCompleted) {
      localStorage.setItem('finishedDailyRoutinesModal', currentDay)
      return true
    }
  }
  return false
}

export const dailyRoutinesCompleted = (state, getters, rootState, rootGetters) => (dayNumber) => {
  const dailyRoutinesCounter = getters.dailyRoutinesCounter(dayNumber)

  return (dailyRoutinesCounter.count > 0 ? !(dailyRoutinesCounter.left) : false)
}

export const dailyActivityCompletion = (state, getters, rootState, rootGetters) => {
  const completion = {}
  Object.keys(state.schedules).forEach(key => {
    const dailyTrainingRoutines = state.schedules[key].items
    const filteredArray = dailyTrainingRoutines?.filter((trainingRoutine) => {
      return !(rootGetters['trainingRoutine/isRoutineDone'](trainingRoutine.activityInstanceId))
    })

    completion[key] = { count: dailyTrainingRoutines?.length, left: filteredArray?.length }
  })
  return completion
}

export const dailyRoutinesCounter = (state, getters, rootState, rootGetters) => (dayNumber) => {
  return getters.dailyActivityCompletion[dayNumber]
}

export const trainingPlanOffsetDay = (state) => {
  return (Math.ceil(Vue.prototype.$date(Vue.prototype.$date().format('YYYY-MM-DD')).diff(Vue.prototype.$date(Vue.prototype.$date(state.startDate).format('YYYY-MM-DD')), 'day', true)) % 7) + 1
}

export const userFriendGroupEvents = (state) => {
  return state.userFriendGroupEvents.filter(el => el.userStatus !== 'declined')
}

export const getFriendGroupEvent = (state) => (id) => {
  return state.userFriendGroupEvents?.find(event => event.id === id)
}

export const getFriendGroupEventParticipants = (state) => (id) => {
  return getFriendGroupEvent(state)(id)
    ?.participants?.filter(el => el.isGoing)
}

export const isUserGoingToEvent = (state, commit, rootState) => (id) => {
  const participantsThatAreGoing = getFriendGroupEventParticipants(state)(id)
  return Boolean(participantsThatAreGoing?.find(el => el.userId === rootState.user.currentUser.id))
}
