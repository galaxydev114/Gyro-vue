import * as api from '@/services/api'

export const markKnowledgeWatched = async ({ dispatch }, knowledgeTimeObject) => {
  const { id, userId, knowledgeTimeId, isDone } = knowledgeTimeObject
  if (isDone) {
    await api.markKnowledgeUndone(userId, knowledgeTimeId)
      .catch(api.handleError)
  } else if (id === 'not-created') {
    await api.markKnowledgeDoneNew(userId, knowledgeTimeId)
      .catch(api.handleError)
  } else {
    await api.markKnowledgeDoneExisting(id)
      .catch(api.handleError)
  }
  return dispatch('fetchUserKnowledgeTimeData')
}

export const fetchUserKnowledgeTimeData = async ({ rootState, commit }) => {
  const response = await api.getUserKnowledges(rootState.user.currentUser.id)
    .catch(api.handleError)

  commit('setUserKnowledgeTimeStatuses', response.data.userKnowledgeTimes)
}

// CRUD
export const createKnowledgeTime = async ({ commit }, knowledgeTimeData) => {
  const resposne = await api.createKnowledge(knowledgeTimeData)
    .catch(api.handleError)

  const knowledgeTime = resposne.data?.knowledgeTime
  if (knowledgeTime) {
    commit('addNewKnowledgeTime', knowledgeTime)
    return knowledgeTime
  }
}

export const fetchAllKnowledges = async ({ commit }) => {
  const response = await api.getKnowledges()
    .catch(api.handleError)

  if (response.status === 200) {
    commit('setKnowledges', response.data.knowledgeTimes)
  }
}

export const updateKnowledgeTime = async ({ commit }, knowledgeTimeData) => {
  const response = await api.updateKnowledge(knowledgeTimeData.id, knowledgeTimeData)
    .catch(api.handleError)

  const knowledgeTime = response.data.knowledgeTime
  if (knowledgeTime) {
    commit('updateKnowledgeTime', knowledgeTime)
  }
}

export const deleteKnowledgeTime = async ({ commit }, knowledgeTimeId) => {
  await api.deleteKnowledge(knowledgeTimeId)
    .catch(api.handleError)
}
