import * as api from '@/services/api'

export async function getCollaborators ({ commit }) {
  const result = await api.getCollaborators()
  if (result.status === 200) {
    commit('setCollaborators', result.data.collaborators)
  }
}
