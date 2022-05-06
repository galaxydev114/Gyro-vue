import * as api from '@/services/api'

export async function getFriendGroups ({ commit }) {
  const result = await api.getFriendGroups()
  if (result.status === 200) {
    commit('setFriendGroups', result.data.friendGroups)
  }
}

export async function getApplications ({ commit }) {
  const result = await api.getUserFriendGroupApplications()
  if (result.status === 200) {
    commit('setApplications', result.data.applications)
  }
}

export async function updateApplication ({ commit }, params) {
  const result = await api.updateUserFriendGroupApplications(params)
  if (result.status === 200) {
    commit('updateApplication', result.data)
  }
  return result.data
}
