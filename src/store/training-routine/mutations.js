export const updateUserRoutine = (state, routine) => {
  state.routines = {
    ...state.routines,
    [routine.id]: routine
  }
}

export const addNewRoutine = (store, routine) => {
  store.routines[routine.id] = routine
}

export const setRoutines = (store, routines) => {
  store.routines = routines?.reduce((map, routine) => {
    map[routine.id] = routine
    return map
  }, {})
}

export const setRoutinesWeights = (store, routines) => {
  store.routinesWeights = routines?.reduce((map, routine) => {
    map[routine.id] = routine
    return map
  }, {})
}

export const setRoutinesConsumedArray = (store, routines) => {
  store.routinesStats = routines?.reduce((map, routine) => {
    if (!map[routine.trainingRoutineId]) {
      map[routine.trainingRoutineId] = {
        title: routine.title,
        trainingRoutineId: routine.trainingRoutineId,
        trainingActivityId: routine.trainingActivityId,
        consumedArray: []
      }
    }
    map[routine.trainingRoutineId].consumedArray.push({
      suggested: parseInt(routine.suggested),
      consumed: parseInt(routine.consumed),
      updatedAt: routine.date
    })
    return map
  }, {})
}

export const setTempAlternativeRoutines = (store, alternativeRoutines) => {
  store.tempAlternativeRoutines = alternativeRoutines
}
export const setTrainingRoutineUserData = (store, trainingRoutineUserData) => {
  store.trainingRoutineUserData = trainingRoutineUserData
}
