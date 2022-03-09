export const titlebarHeight = (state, height) => {
  state.titlebarHeight = height
}
export const setHasError = (state, hasError) => {
  state.hasError = hasError
}
export const toc = (state, toc) => {
  state.toc.splice(0, state.toc.length, ...toc)
}
export const togglePageLoaded = (state, value = true) => {
  state.pageLoaded = value
}
export const toggleSignWallModal = (state, value = true) => {
  state.isSignWallVisible = value
}
export const toggleSignWallModalEx = (state, { active = true, referralCode }) => {
  state.signupReferralCode = referralCode
  state.isSignWallVisible = active
}
export const setShowPreferencesdModalString = (state, value) => {
  state.preferencesModalString = value
}
