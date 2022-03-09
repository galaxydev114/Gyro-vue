import * as api from '@/services/api'

export async function getPlatformUpdates ({ state, commit }) {
  return api.getPlatformUpdates().then(response => {
    commit('setPlatformUpdates', response.data.updates)
  })
}
