import * as api from '@/services/api'

/** @param {import('vuex').ActionContext} ctx */
export const getTrackedRoutinesProgress = async (ctx) => {
  const userId = ctx.rootState.user.currentUser.id
  const response = await api.getUserTrackedRoutinesProgress(userId)
  if (response.status === 200) {
    ctx.commit('setUserTrackedRoutinesProgress', response.data.trackingRoutinesProgress)
  }
}

/** @param {import('vuex').ActionContext} ctx */
export const getUserProgress = async (ctx) => {
  const userId = ctx.rootState.user.currentUser.id
  const season = ctx.state.season
  const view = ctx.state.view
  const mode = ctx.state.mode

  const response = await api.getUserProgress(userId, { season, view, mode })
  if (response.status === 200) {
    ctx.commit('setUserProgress', response.data.progress.user)
    ctx.commit('setUserScore', response.data.progress.userScore)
    ctx.commit('setAverateUserProgress', response.data.progress.averageUser)
  }
}

/** @param {import('vuex').ActionContext} ctx */
export const reloadUserProgress = async (ctx) => {
  const userId = ctx.rootState.user.currentUser.id

  const response = await api.reloadUserProgress(userId)
  if (response.status === 200) {
    ctx.dispatch('getUserProgress')
  }
}

/**
 * @param {import('vuex').ActionContext} ctx
 * @param {'user' | 'average_user'} type
 * */
export const toggleFilter = async (ctx, type) => {
  if (type === 'user') {
    ctx.commit('setFilter', {
      type: 'user',
      value: !ctx.state.isUserFilterEnabled
    })
  }

  if (type === 'average_user') {
    ctx.commit('setFilter', {
      type: 'average_user',
      value: !ctx.state.isAverageUserFilterEnabled
    })
  }
}
