export const knowledgeTimes = (state, getters, rootState) => {
  return state.knowledgeTimes
}

export const knowledgeTimeActivityDuration = (state) => {
  return Object.values(state.knowledgeTimes)
    .filter(v => !v.isCompleted)
    .reduce((result, item) => result + item.videoDurationSeconds / 60, 0)
}
