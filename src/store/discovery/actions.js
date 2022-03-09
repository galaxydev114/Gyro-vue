import * as api from '@/services/api'

// TODO: NOt in use check if needed with IHOR
export const fetchNewestActivities = async (ctx) => {
  const response = await api.getNewestActivities()

  if (response.status === 200) {
    const activities = response.data?.activities?.newest || []
    ctx.commit('setNewestActivities', activities)
  }
}

export const discoverActivities = async (ctx, userId) => {
  const response = await api.discoverActivities(userId)

  if (response.status === 200) {
    const { exclusive, newest, popular, all } = response.data?.activities

    ctx.commit('setNewestActivities', newest)
    ctx.commit('setExclusiveActivities', exclusive)
    ctx.commit('setPopularActivities', popular)
    ctx.commit('setAllActivities', all)
  }
}

export const fetchAllSkillTypes = async (ctx) => {
  const response = await api.getAllSkillTypes()

  if (response.status === 200) {
    const skills = response.data.skills

    ctx.commit('setSkills', skills)
  }
}
