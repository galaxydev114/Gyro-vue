export const getRoutineCategoryNormalized = (category) => {
  return category?.replace(' ', '_').toLowerCase()
}

export const getActivityTypeFromCategory = (category) => {
  if (category) {
    const normalizedCategory = getRoutineCategoryNormalized(category)
    if (normalizedCategory === 'knowledge') {
      return 'knowledgetime'
    } else if (normalizedCategory === 'workshop') {
      return 'gamesenseworkshop'
    }
  }

  return 'routine'
}
