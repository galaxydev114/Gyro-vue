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

export const createSession = async ({ commit }, sessionData) => {
  const resposne = await api.createSession(sessionData)
    .catch(handleError)

  const session = resposne.data?.session
  if (session) {
    commit('addNewSession', session)
    return session
  }
}

export const updateSession = async ({ commit }, sessionData) => {
  const response = await api.updateSession(sessionData.id, sessionData)
    .catch(handleError)

  const session = response.data.session
  if (session) {
    commit('updateSession', session)
  }
}

export const fetchAllSessions = async ({ commit }) => {
  const response = await api.getSessions(null, true)
    .catch(handleError)

  if (response.status === 200) {
    commit('setSessions', response.data.sessions)
  }
}

export const deleteSession = async ({ commit }, sessionId) => {
  return api.deleteSession(sessionId)
    .catch(handleError)
}
