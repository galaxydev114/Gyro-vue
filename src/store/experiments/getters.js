export const userExperiments = (state) => {
  return state.userExperiments
}
export const experimentActive = (state, getters) => experimentId => {
  const experiment = localStorage.getItem(experimentId)

  if (experiment !== null) {
    if (experiment === 'true') {
      return true
    } else if (experiment === 'false') {
      return false
    }
  } else {
    return getters.userExperiments && getters.userExperiments[experimentId]
  }
}

export const experimentGyroForceLinkEpic = (state, getters) => {
  return getters.experimentActive('GYRO_FORCE_LINK_EPIC')
}

export const experimentCourses = (state, getters) => {
  return getters.experimentActive('GYRO_COURSES')
}

export const isNewOnboardingVideo = (state, getters) => {
  return getters.experimentActive('GYRO_IS_NEW_ONBOARDING_VIDEO')
}
