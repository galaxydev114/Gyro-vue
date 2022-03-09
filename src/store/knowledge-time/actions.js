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

export const markKnowledgeWatched = async ({ dispatch }, knowledgeTimeObject) => {
  const { id, userId, knowledgeTimeId, isDone } = knowledgeTimeObject
  if (isDone) {
    await api.markKnowledgeUndone(userId, knowledgeTimeId)
      .catch(handleError)
  } else if (id === 'not-created') {
    await api.markKnowledgeDoneNew(userId, knowledgeTimeId)
      .catch(handleError)
  } else {
    await api.markKnowledgeDoneExisting(id)
      .catch(handleError)
  }
  return dispatch('fetchUserKnowledgeTimeData')
}

export const fetchUserKnowledgeTimeData = async ({ rootState, commit }) => {
  const response = await api.getUserKnowledges(rootState.user.currentUser.id)
    .catch(handleError)

  commit('setUserKnowledgeTimeStatuses', response.data.userKnowledgeTimes)
}

// CRUD
export const createKnowledgeTime = async ({ commit }, knowledgeTimeData) => {
  const resposne = await api.createKnowledge(knowledgeTimeData)
    .catch(handleError)

  const knowledgeTime = resposne.data?.knowledgeTime
  if (knowledgeTime) {
    commit('addNewKnowledgeTime', knowledgeTime)
    return knowledgeTime
  }
}

export const fetchAllKnowledges = async ({ commit }) => {
  const response = await api.getKnowledges()
    .catch(handleError)

  if (response.status === 200) {
    commit('setKnowledges', response.data.knowledgeTimes)
  }
}

export const updateKnowledgeTime = async ({ commit }, knowledgeTimeData) => {
  const response = await api.updateKnowledge(knowledgeTimeData.id, knowledgeTimeData)
    .catch(handleError)

  const knowledgeTime = response.data.knowledgeTime
  if (knowledgeTime) {
    commit('updateKnowledgeTime', knowledgeTime)
  }
}

export const deleteKnowledgeTime = async ({ commit }, knowledgeTimeId) => {
  await api.deleteKnowledge(knowledgeTimeId)
    .catch(handleError)
}
