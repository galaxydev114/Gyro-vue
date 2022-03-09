import * as api from '@/services/api'

/**
 * @param {Error | import('axios').AxiosError} err
 */
const handleError = err => {
  if (err.response) {
    throw new Error(err.response.data)
  }

  throw err
}

export const setSessionScoreGetStats = async ({ dispatch, commit }, { routineId, sessionId, score }) => {
  const resposne = await api.setSessionScoreGetStats(sessionId, score)
    .catch(handleError)

  const scoreStats = resposne.data?.scoreStats
  if (scoreStats) {
    commit('session/addSessionStats', scoreStats,
      { root: true })
  }
  return dispatch('fetchUserTrainingRoutineSessions', routineId)
}

export const getSessionScoreStats = async ({ commit }, sessionId) => {
  const resposne = await api.getSessionScoreStats(sessionId)
    .catch(handleError)

  const scoreStats = resposne.data?.scoreStats
  if (scoreStats) {
    commit('session/addSessionStats', scoreStats,
      { root: true })
    return scoreStats
  }
}

export const markSessionAsDone = async ({ dispatch }, { routineId, sessionId }) => {
  await api.markSessionAsDone(routineId, sessionId).catch(handleError)
  return dispatch('fetchUserTrainingRoutineSessions', routineId)
}

export const markRoutineAsDone = async ({ dispatch }, { routineId }) => {
  await api.markRoutineAsDone(routineId).catch(handleError)
  return dispatch(
    'trainingPlan/fetchUserCurrentTrainingPlan',
    null,
    { root: true }
  )
}

export const markActivitiesAsDone = async ({ dispatch }, activitiesIds) => {
  await Promise.all(
    activitiesIds.map(id => api.markRoutineAsDone(id).catch(handleError))
  )

  return dispatch('trainingPlan/fetchUserCurrentTrainingPlan', null, { root: true })
}

export const deleteRoutineFromTrainingPlan = async ({ dispatch, rootState }, { routineId }) => {
  const userId = rootState.user.currentUser?.id
  await api.deleteRoutineFromTrainingPlan(userId, routineId).catch(handleError)

  return dispatch(
    'trainingPlan/fetchUserCurrentTrainingPlan',
    null,
    { root: true }
  )
}

export const createRoutine = async ({ commit }, routineData) => {
  const resposne = await api.createRoutine(routineData)
    .catch(handleError)

  const routine = resposne.data?.routine
  if (routine) {
    commit('addNewRoutine', routine)
    return routine
  }
}

export const fetchAllRoutinesWithWeightsArray = async ({ commit }) => {
  const isWeightOverTime = true
  const response = await api.getRoutines(isWeightOverTime)
    .catch(handleError)

  if (response.status === 200) {
    commit('setRoutinesWeights', response.data.trainingRoutinesWeights)
    commit('setRoutinesConsumedArray', response.data.trainingRoutinesConsumed)
  }
}

export const fetchAllRoutines = async ({ commit }) => {
  const response = await api.getRoutines()
    .catch(handleError)

  if (response.status === 200) {
    commit('setRoutines', response.data.trainingRoutines)
  }
}

export const updateRoutine = async ({ commit }, routineData) => {
  const response = await api.updateRoutine(routineData.id, routineData)
    .catch(handleError)

  const routine = response.data.routine
  if (routine) {
    commit('updateRoutine', routine)
  }
}

export const fetchUserTrainingRoutineSessions = async ({ commit }, userTrainingRoutineId) => {
  const response = await api.getTrainingRoutineSessions(userTrainingRoutineId)
    .catch(handleError)

  commit('addNewRoutine', response.data.trainingRoutine)

  commit('userSession/setUserTrainingSessions', {
    userTrainingSessions: response.data.trainingSessions,
    userTrainingRoutineId: userTrainingRoutineId
  }, { root: true })
}

export const fetchRoutinesSessions = async ({ commit }, userTrainingRoutineIds) => {
  const response = await api.getTrainingRoutinesSessions(userTrainingRoutineIds)
    .catch(handleError)
  commit('userSession/setUserTrainingSessionsBatch', response.data.trainingRoutines, { root: true })
}

export const deleteRoutine = async ({ commit }, routineId) => {
  await api.deleteRoutine(routineId)
    .catch(handleError)
}

export const createNewUserRoutine = async ({ commit, rootState, dispatch }, routine) => {
  const userId = rootState.user.currentUser.id

  const response = await api.createUserRoutine(userId, routine.id)
  const userTrainingRoutine = response.data?.userTrainingRoutine

  if (userTrainingRoutine) {
    commit('addNewRoutine', userTrainingRoutine)
    await dispatch('fetchUserTrainingRoutineSessions', userTrainingRoutine.id)
    return userTrainingRoutine
  }
}

export const fetchAlternativeRoutines = async ({ commit, rootState }, { excludeIds = [], skillBased }) => {
  const userId = rootState.user.currentUser.id

  return api.getAlternativeRoutines(userId, excludeIds, skillBased)
    .then((response) => {
      if (response.status === 200) {
        commit('setTempAlternativeRoutines', response.data.alternativeRoutines || [])
      }
    })
    .catch(handleError)
}

export const getRoutineUserData = async ({ commit, rootState }, { trainingRoutineId, userId }) => {
  return api.getRoutineUserData(userId, trainingRoutineId)
    .then((response) => {
      if (response.status === 200) {
        commit('setTrainingRoutineUserData', response.data || {})
      }
    })
    .catch(handleError)
}
