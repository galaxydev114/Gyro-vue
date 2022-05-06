import * as api from '@/services/api'

export const createSession = async ({ commit }, sessionData) => {
  const resposne = await api.createSession(sessionData)
    .catch(api.handleError)

  const session = resposne.data?.session
  if (session) {
    commit('addNewSession', session)
    return session
  }
}

export const updateSession = async ({ commit }, sessionData) => {
  const response = await api.updateSession(sessionData.id, sessionData)
    .catch(api.handleError)

  const session = response.data.session
  if (session) {
    commit('updateSession', session)
  }
}

export const fetchAllSessions = async ({ commit }) => {
  const response = await api.getSessions(null, true)
    .catch(api.handleError)

  if (response.status === 200) {
    commit('setSessions', response.data.sessions)
  }
}

export const deleteSession = async ({ commit }, sessionId) => {
  return api.deleteSession(sessionId)
    .catch(api.handleError)
}

export const resetScoreUserSession = async ({ commit }, sessionId) => {
  return api.resetScoreUserSession(sessionId)
    .catch(api.handleError)
}
