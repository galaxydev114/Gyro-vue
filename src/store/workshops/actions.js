import * as api from '@/services/api'

export const discoverWorkshops = async (ctx, userId) => {
  const response = await api.discoverWorkshops(userId)

  if (response.status === 200 && response.data) {
    const { workshops, numPages, newAndRelevant } = response.data

    ctx.commit('setAllWorkshops', workshops)
    ctx.commit('setAllWorkshopsNumPages', numPages)
    ctx.commit('setNewAndRelevant', newAndRelevant)
  }
}

export const getAllAdminWorkshops = async (ctx) => {
  const response = await api.getAdminAllWorkshops()

  if (response.status === 200 && response.data) {
    const { workshops } = response.data

    ctx.commit('setAllAdminWorkshops', workshops)
  }
}

export const deleteWorkshop = async (ctx, workshopId) => {
  return api.deleteWorkshop(workshopId)
}

export const updateWorkshop = async (ctx, { workshopId, workshopData }) => {
  return api.updateWorkshop(workshopId, workshopData)
}

export const fetchAllCategories = async (ctx) => {
  const response = await api.getAllWorkshopCategories()

  if (response.status === 200) {
    const categories = response.data.categories

    ctx.commit('setCategories', categories)
  }
}
