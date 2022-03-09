export const getUserSession = (state) => (routineId, sessionId) => {
  const routineSessions = state.sessionsPerRoutine[routineId]

  if (routineSessions) {
    return routineSessions.find(session => session.id === sessionId)
  }
}

export const getUserRoutineSessions = (state) => (routineId) => {
  return state.sessionsPerRoutine[routineId]
}

export const getUserSessionStats = (state) => (trainingSessionId) => {
  return state.sessionsStats[trainingSessionId]
}
