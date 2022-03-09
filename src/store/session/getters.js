export const getSession = (state) => (sessionId) => {
  return state.sessions[sessionId]
}

export const getSessions = (state) => () => {
  return state.sessions
}

export const getSessionStats = (state) => (trainingSessionId) => {
  return state.sessionsStats ? state.sessionsStats[trainingSessionId] : null
}
