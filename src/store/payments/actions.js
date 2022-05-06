import * as api from '@/services/api'

export const getPaymentPlans = async ({ commit }) => {
  const response = await api.getPaymentPlans()
  commit('setPaymentPlans', response.data)
}

export const getCheckoutPageUrl = async (ctx, { userId, paymentPlanId, couponCode }) => {
  const res = await api.getCheckoutPageUrl(userId, paymentPlanId, couponCode)
  return res.data
}

export const getSubscription = async ({ commit }) => {
  const res = await api.getSubscription()
  commit('setUserSubscription', res.data)
}
export const cancelSubscription = async () => {
  const res = await api.cancelSubscription()
  return res.data
}
export const resumeSubscription = async (ctx) => {
  await api.resumeSubscription()
  await ctx.dispatch('user/loadUser', null, { root: true })
}
