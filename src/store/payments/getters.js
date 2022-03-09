export const showPaywall = (state) => {
  return state.showPaywall
}

export const showUserSubscriptions = (state) => {
  return state.showUserSubscriptions
}

export const userSubscription = (state) => {
  return state.userSubscription
}

export const userSubscriptionStatus = (state) => {
  return state.userSubscription?.bluesnap?.autoRenew ? 'active' : 'cancelled'
}

export const userSubscriptionPaymentMode = (state) => {
  return state.userSubscription?.bluesnap?.paymentInfo?.type
}

export const plans = (state) => {
  return state.plans
}
