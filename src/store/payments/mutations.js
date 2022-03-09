export const setPaymentPlans = (state, plans) => {
  state.plans = plans
}

export const setPaywall = (state, { show }) => {
  if (show !== undefined) state.showPaywall = show
}

export const setUserSubscription = (state, subscription) => {
  state.userSubscription = subscription
}

export const setShowUserSubscriptions = (state, show) => {
  if (show !== undefined) state.showUserSubscriptions = show
}

export const setIsUpgradeButtonTriggerPayWall = (state, val) => {
  state.isUpgradeButtonTriggerPayWall = val
}

export const setIsPaymentDetailsFinishLoading = (state, val) => {
  state.isPaymentDetailsFinishLoading = val
}
