export const course = (state, getters) => (id) => {
  return state.courses.find(course => course.id === id)
}
