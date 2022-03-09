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

export const experimentGyroOnboardingGoal = (state, getters) => {
  return getters.experimentActive('GYRO_ONBOARDING_GOAL')
}

export const experimentGyroForceLinkEpic = (state, getters) => {
  return getters.experimentActive('GYRO_FORCE_LINK_EPIC')
}

export const experimentIsFirstBoardViewExperiment = (state, getters) => {
  return getters.experimentActive('GYRO_IS_FIRST_BOARD_VIEW')
}
