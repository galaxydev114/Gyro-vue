export const notes = (state) => {
  return Object.values(state.notes)
    .filter(note => note.deleted !== true)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}
