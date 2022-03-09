import * as api from '@/services/api'

export async function getCoaches ({ commit }) {
  const result = await api.getCoaches()
  if (result.status === 200) {
    commit('setCoaches', result.data.coaches)
  }
}
