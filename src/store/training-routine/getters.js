export const trainingRoutine = (state, getters, rootState) => (id) => {
  const routine = state.routines[id]
  const sessions = Object.values(rootState.userSession.sessionsPerRoutine[id] || {})

  return {
    ...routine,
    sessions: sessions || []
  }
}

export const isRoutineDone = (state, getters, rootState) => (id) => {
  const routine = getters.trainingRoutine(id)
  return Boolean(routine.isCompleted)
}

export const getAlternativeRoutines = (state) => {
  return state.tempAlternativeRoutines
}

export const getTrainingRoutineUserData = (state) => {
  return state.trainingRoutineUserData
}

export const getRoutineStatus = (state, getters, rootState) => (routineId) => {
  const sessions = rootState.userSession.sessionsPerRoutine[routineId]

  if (!sessions || !sessions.length) {
    return { done: null, length: 0 }
  }

  const doneSessions = sessions.reduce((howMuchDone, session) => {
    if (session.isDone) howMuchDone += 1
    return howMuchDone
  }, 0)

  return { done: doneSessions, length: sessions.length }
}

export const getRoutine = (state) => (id) => {
  return state.routines[id]
}

export const getRoutineDuration = (state, getters, rootState) => routineId => {
  return rootState.userSession.sessionsPerRoutine[routineId]
    .reduce((duration, session) => duration + session.duration, 0)
}
