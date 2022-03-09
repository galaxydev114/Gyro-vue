export const setUserProgress = (state, progress) => {
  state.userProgress = progress
}

export const setUserScore = (state, score) => {
  state.userScore = score
}

export const setAverateUserProgress = (state, progress) => {
  state.averageUserProgress = progress
}

export const setUserTrackedRoutinesProgress = (state, progress) => {
  state.userTrackedRoutinesProgress = progress
}

/**
 * @param {*} state
 * @param {{ type: 'user' | 'average_user', value: boolean }} payload
 */
export const setFilter = (state, payload) => {
  if (payload.type === 'user') {
    state.isUserFilterEnabled = payload.value
  }

  if (payload.type === 'average_user') {
    state.isAverageUserFilterEnabled = payload.value
  }
}

export const setView = (state, view) => {
  state.view = view
}

export const setMode = (state, mode) => {
  state.mode = mode
}
