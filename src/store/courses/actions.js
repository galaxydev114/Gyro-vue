import * as api from '@/services/api'

export async function getUserCourses ({ rootState, commit }) {
  const userId = rootState.user.currentUser.id
  if (!userId) {
    return
  }
  const result = await api.getUserCourses(userId).catch(api.handleError)
  if (result.status === 200) {
    commit('setCourses', result.data.courses)
  }
}

export const markKnowledgeActivityDone = async ({ dispatch }, { userId, knowledgeTimeId }) => {
  await api.markKnowledgeDoneNew(userId, knowledgeTimeId).catch(api.handleError)
  return dispatch('getUserCourses')
}
