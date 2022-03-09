export const setUserTrainingSessions = (store, { userTrainingSessions, userTrainingRoutineId }) => {
  store.sessionsPerRoutine = {
    ...store.sessionsPerRoutine,
    [userTrainingRoutineId]: userTrainingSessions
  }
}

export const setUserTrainingSessionsBatch = (store, trainingRoutines) => {
  Object.entries(trainingRoutines).forEach(entry => {
    const payload = {
      userTrainingRoutineId: entry[0],
      userTrainingSessions: entry[1]
    }

    setUserTrainingSessions(store, payload)
  })
}
