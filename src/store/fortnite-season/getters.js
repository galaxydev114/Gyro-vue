export const isTagsContainCurrentSeason = (state) => (tags = []) => {
  return tags.some(tag => tag.toLowerCase() === state.tag.toLowerCase())
}

export const urlToGenerateTp = state => {
  return `${process.env.VUE_APP_PAGE_URL}${state.pathToGenerateTp}`
}
