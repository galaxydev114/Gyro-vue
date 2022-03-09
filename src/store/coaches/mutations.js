export const setCoaches = (state, coaches = []) => {
  state.coaches = coaches.reduce((result, coach) => {
    result[coach.name.toLowerCase()] = coach
    return result
  }, {})
}
