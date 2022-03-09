export const setAccessCodeValid = (state, accessCodeValidation) => {
  state.accessCodeValid = accessCodeValidation
}
export const setAccessCode = (state, accessCode) => {
  state.accessCode = accessCode
}
export const setAccessCodeRole = (state, role) => {
  state.accessCodeRole = role
}

export const setAccessCodes = (store, accessCodes) => {
  if (accessCodes?.length) {
    store.accessCodesList = accessCodes
  }
}
